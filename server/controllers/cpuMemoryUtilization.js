const { CpuMemoryUtilization } = require("../database/models");
const Promise = require("bluebird");
const async = require("async");
const mongoose = require("mongoose");

exports.add = data => {
  new CpuMemoryUtilization(data)
    .save()
    .then(result => {
      // console.log(result)
    })
    .catch(err => {
      console.log(err);
    });
};

// setInterval(() => {
//   // This function calls every 30mins and do the following actions repeatly.
//   // 1. Get the max value of cpu usage and memory available
//   // 2. Remove all values in the database
//   // 3. Save new data with max values

//   CpuMemoryUtilization.aggregate(
//     [
//       {
//         $group: {
//           _id: "$deviceId",
//           maxCpuUsage: { $max: "$cpuUsage" },
//           maxMemoryAvailable: { $max: "$memoryAvailable" }
//         }
//       }
//     ],
//     (err, results) => {
//       if (err) throw err;
//       results.map(result => {
//         const now = new Date();
//         CpuMemoryUtilization.remove(
//           { deviceId: result._id },
//           { createdAt: { $gte: new Date(now.getTime() - 1000 * 60 * 30) } },
//           { createdAt: { $lte: now } }
//         )
//           .then(response => {
//             new CpuMemoryUtilization({
//               deviceId: result._id,
//               cpuUsage: result.cpuUsage,
//               memoryAvailable: result.memoryAvailable
//             }).save();
//           })
//           .catch(error => {
//             console.log(error);
//           });
//       });
//     }
//   );
// }, 1000);

// exports.getUtilizationData = (deviceId, cb) => {
//   const now = new Date()
//   const last_day = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

//   CpuMemoryUtilization.aggregate(
//     [
//       {
//         $group: {
//           _id: {
//             year: { $year: '$createdAt' },
//             month: { $month: '$createdAt' },
//             day: { $dayOfMonth: '$createdAt' },
//             deviceId: '$deviceId'
//           },
//           cpuUsage: { $max: '$cpuUsage' },
//           memoryAvailable: { $max: '$memoryAvailable' }
//         }
//       },
//       {
//         $match: {
//           '_id.deviceId': mongoose.Types.ObjectId(deviceId),
//           '_id.year': now.getFullYear(),
//           '_id.moth': now.getMonth() + 1
//         }
//       }
//     ],
//     (err, result) => {
//       if (err) {
//         return cb(err)
//       }
//       let response = []
//       for (let i = 1; i <= last_day; i++) {
//         let d = []
//         for (const data of result) {
//           if (i === data.day) {
//             d = data
//           }
//         }
//         response.push(d)
//       }
//       cb(null, response)
//     }
//   )
// }

exports.getUtilizationData = (req, res) => {
  const { deviceId } = req.params;
  const now = new Date();
  const last_day = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  CpuMemoryUtilization.aggregate(
    [
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            deviceId: "$deviceId"
          },
          cpuUsage: { $max: "$cpuUsage" },
          memoryAvailable: { $max: "$memoryAvailable" }
        }
      },
      {
        $match: {
          "_id.deviceId": mongoose.Types.ObjectId(deviceId),
          "_id.year": now.getFullYear(),
          "_id.month": now.getMonth() + 1
        }
      }
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      let response = [];
      for (let i = 1; i <= last_day; i++) {
        let d = [];
        for (const data of result) {
          if (i === data._id.day) {
            d = data;
          }
        }
        response.push(d);
      }
      res.json(response);
    }
  );
};
