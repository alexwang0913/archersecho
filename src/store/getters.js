/*=========================================================================================
  File Name: getters.js
  Description: Vuex Store - getters
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/


const getters = {

	// COMPONENT
		// vx-autosuggest
	starredPages: state => state.navbarSearchAndPinList.data.filter((page) => page.highlightAction),
}

export default getters