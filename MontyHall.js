class MontyHall {

	constructor(auto_play_game = false, num_doors = 3) {
		this.num_doors = num_doors;
		this.doors = [];
		this.choosen_door = -1;
		this.game_done = false;
		
		this.initializeDoors();
		this.drawDoors();

		if (auto_play_game) {
			this.loop_counter = 0;
			this.order_of_doors_to_open = this.randomShuffle(this.initializeOrderOfDoorsToOpen());
			if (this.doors[this.order_of_doors_to_open[0]].grand_prize || this.doors[this.order_of_doors_to_open[this.num_doors-1]].grand_prize) {
				this.autoPlay();
				let result = {
					'choosen_door_number': this.order_of_doors_to_open[0]+1,
					'choosen_door_is_grand_prize': this.doors[this.order_of_doors_to_open[0]].grand_prize,
					'last_door_number': this.order_of_doors_to_open[this.num_doors-1]+1,
					'last_door_is_grand_prize': this.doors[this.order_of_doors_to_open[this.num_doors-1]].grand_prize,
				};
				let results = JSON.parse(localStorage.getItem("results"));
				if (!results) {
					results = [];
				}
				results.push(result);
				localStorage.setItem("results", JSON.stringify(results));
			}
		}
	}


	initializeDoors = () => {
		let temp_door;
		//initialize all doors to non-winning doors
		for (let x=0; x<this.num_doors; x++) {
			temp_door = new Door();
			this.doors.push(temp_door);
		}
		//put the grand prize in one of the doors randomly
		let prize_index = Math.floor(Math.random() * Math.floor(this.num_doors));
		this.doors[prize_index].grand_prize = true;
	}

	drawDoors = () => {
		let temp_html = '';
		for (let x=0; x<this.num_doors; x++) {
			temp_html += '<div id="door-'+x+'" onClick="openDoor('+x+');" class="door-container"><img src="images/door.png" /></div>';
		}
		$('body').append(temp_html);
	}

	openDoor = (door_index) => {
		if (this.choosen_door == -1) { //first door to be opened should be choosen door
			this.doors[door_index].opened = true;
			this.choosen_door = door_index;
			$('#door-'+door_index).css('border-color', '#98FB98');
			$('#door-'+door_index).append('<div class="door-label">Your Door</div>');
			return;
		}
		//check if the door to be opened is the choosen door
		if (door_index == this.choosen_door) {
			return;
		}
		if (!this.doors[door_index].opened) {
			this.doors[door_index].opened = true;
			this.showWhatsInsideTheDoor(door_index);
		}
		//check if all of the doors has been revealed
		if (this.checkIfAllDoorsAreOpened()) {
			this.showWhatsInsideTheDoor(this.choosen_door);
			this.game_done = true;
		}
	}

	showWhatsInsideTheDoor = (door_index) => {
		let temp_image = (this.doors[door_index].grand_prize==true) ? 'car.png' : 'goat.jpg';
		$('#door-'+door_index).html('<img width="100%" src="images/'+temp_image+'" /></div>');
	}

	checkIfAllDoorsAreOpened = () => {
		for (let x=0; x<this.num_doors; x++) {
			if (!this.doors[x].opened) {
				return false;
			}
		}
		return true;
	}

	initializeOrderOfDoorsToOpen = () => {
		let temp_order = [];
		for (let x=0; x<this.num_doors; x++) {
			temp_order.push(x);
		}
		return temp_order;
	}

	autoPlay = () => {
		setTimeout(() => {
			if (this.loop_counter < this.num_doors) {
				this.openDoor(this.order_of_doors_to_open[this.loop_counter]);
				this.autoPlay();
			}
			this.loop_counter++;
		}, 0);
	}

	randomShuffle = (o) => {
	    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	}

}

class Door {

	constructor() {
		this.opened = false;
		this.grand_prize = false;
	}
	
}