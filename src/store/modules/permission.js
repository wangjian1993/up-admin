export default {
	state: {
		buttons: []
	},
	getters: {
		buttons: state => {
			return state.buttons
		},
	},
	action: {
		bottonsAction({
			commit
		}, data) {
			commit('setBottons', data)
		},
	},
	mutations: {
		setBottons(state, data) {
			state.buttons = data
		},
	}
}
