const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 0
})

class DealOrNoDeal {

	constructor(auto_play_game = false) {
		this.num_cases = 26;
		this.cases = [
			0.01, 0.10, 0.5, 1, 5, 10, 50, 75, 100, 200, 300, 500, 750,
			1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
		];
		this.hasChosenOwnCase = false;
		this.cases = this.randomShuffle(this.cases);
		this.is_opened = this.initializeOpened();
		this.order_of_cases_to_open = this.randomShuffle(this.initializeOrderOfCasesToOpen());
		this.createDivCases();
		this.auto_play_game = auto_play_game;
		if (this.auto_play_game) {
			this.loop_counter = 0;
			this.playGameAutomatically();
			if (this.cases[this.order_of_cases_to_open[0]]===1000000 || this.cases[this.order_of_cases_to_open[this.num_cases-1]]===1000000) {
				let result = {
					'choosen_case_number': this.order_of_cases_to_open[0],
					'choosen_case_value': this.cases[this.order_of_cases_to_open[0]],
					'last_case_number': this.order_of_cases_to_open[this.num_cases-1],
					'last_case_value': this.cases[this.order_of_cases_to_open[this.num_cases-1]],
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

	playGameAutomatically = () => {
		setTimeout(() => {
			if (this.loop_counter < this.num_cases-1) {
				if (!this.is_opened[this.order_of_cases_to_open[this.loop_counter]]) {
					this.openCase(this.order_of_cases_to_open[this.loop_counter]);
				}
				this.playGameAutomatically();
			}
			this.loop_counter++;
		}, 0);
	}

	createDivCases = () => {
		$('#all-cases').remove();
		let temp_html = '';
		$('body').append('<div id="all-cases"></div>');
		for (let x=0; x<this.num_cases; x++) {
			temp_html += '<div class="cases" id="case-'+x+'" onClick="openCase('+x+')"><div class="case-label">'+(x+1)+'</div><div class="case-value" id="case-value-'+x+'">?</div></div>';
		}
		$('#all-cases').html(temp_html);
	}

	randomShuffle = (o) => {
	    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	}

	openCase = (case_number) => {
		if (this.is_opened[case_number]) {
			return;
		}
		this.is_opened[case_number] = true;
		if (!this.hasChosenOwnCase) {
			this.hasChosenOwnCase = true;
			$('#case-'+case_number).remove();
			$('#selected-case').remove();
			$('body').append('<hr class="divider" /><div class="cases"><div class="case-label">'+(case_number+1)+'</div><div class="case-value" id="case-value-'+case_number+'">?</div></div>');
		} else {
			$('#case-value-'+case_number).html(formatter.format(this.cases[case_number]));
			$('#case-'+case_number).addClass('case-open');
		}
		console.log("Opening case number "+(case_number+1)+" and it contains "+this.cases[case_number]+".");
	}

	initializeOpened = () => {
		let temp_is_opened = [];
		for (let x=0; x<this.num_cases; x++) {
			temp_is_opened.push(false);
		}
		return temp_is_opened;
	}

	initializeOrderOfCasesToOpen = () => {
		let temp_order = [];
		for (let x=0; x<this.num_cases; x++) {
			temp_order.push(x);
		}
		return temp_order;
	}

}