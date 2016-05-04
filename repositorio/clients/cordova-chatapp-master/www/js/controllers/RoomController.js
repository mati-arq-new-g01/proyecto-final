(function(){
	angular.module('starter')
	.controller('RoomController', ['$scope', '$state', 'localStorageService', 'SocketService', 'moment', '$ionicScrollDelegate', RoomController]);
	
	function RoomController($scope, $state, localStorageService, SocketService, moment, $ionicScrollDelegate){

		var me = this;

		me.messages = [];

		$scope.humanize = function(timestamp){
			return moment(timestamp).fromNow();
		};

		me.current_room = localStorageService.get('room');
		
		
		
		var title = localStorageService.get('title');
		var current_user = localStorageService.get('username');

		me.title = title;
		
		$scope.isNotCurrentUser = function(user){
			
			if(current_user != user){
				return 'not-current-user';
			}
			return 'current-user';
		};


		$scope.sendTextMessage = function(){

			var msg = {
				'room': me.current_room,
				'user': current_user,
				'text': me.message + JSON.stringify(SocketService),
				'time': moment()
			};

			
			me.messages.push(msg);
			$ionicScrollDelegate.scrollBottom();

			me.message = '';
			
			SocketService.emit('send:message', msg);
			
			SocketService.on ('connection', function (data) {
			  console.log(data);
			});
		};


		$scope.leaveRoom = function(){
	
			var msg = {
				'user': current_user,
				'room': me.current_room,
				'time': moment()
			};

			SocketService.emit('leave:room', msg);
			$state.go('rooms');

		};


		SocketService.on('message', function(msg){
			me.messages.push(msg);
			$ionicScrollDelegate.scrollBottom();
		});


	}

})();