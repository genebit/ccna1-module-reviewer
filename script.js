const failSfx = new Audio("assets/failed-sfx.mp3")
const passSfx = new Audio("assets/passed-sfx.mp3")

function shuffleOptions(options) {
	for (let i = options.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[options[i], options[j]] = [options[j], options[i]]
	}
}

function getCorrectAnswers(res, index) {
	let correctAnswers = []
	res["QUESTIONS"][index].ANSWERS.forEach((element) => {
		// if the word correct exist
		if (element.includes("[/]")) {
			element = element.substring(element.search("[/]") + "[/]".length, element.length)
			correctAnswers.push(element)
		}
	})
	return correctAnswers
}

function getTotalAnswers(res, index) {
	let total = 0
	res["QUESTIONS"][index].ANSWERS.forEach((element) => {
		// if the word correct exist
		if (element.includes("[/]")) {
			total++
		}
	})
	return total
}

$.ajax({
	dataType: "json",
	url: "resources/data.json",
	success: function (res) {
		const QUESTIONNAIRE_SIZE = res["QUESTIONS"].length
		const DEFAULT_OPTION_CLASS = "card shadow-sm p-3"
		let questionnareNumber = 1,
			k = 1

		$("total-items").html(QUESTIONNAIRE_SIZE)

		for (let i = 1; i <= QUESTIONNAIRE_SIZE; i++) {
			let template = $("[questionnaire-item-jump-btn]")[0].content.cloneNode(true).children[0]
			template.textContent = i
			template.href = `#${i - 1}`
			template.id = `NavItem-${i}`
			$("#QuestionnaireNavBtnContainer").append(template)
		}

		for (let i = 0; i < QUESTIONNAIRE_SIZE; i++) {
			let title = res["QUESTIONS"][i].TITLE
			let answers = []

			res["QUESTIONS"][i].ANSWERS.forEach((element) => {
				if (element.includes("[/]")) {
					element = element.substring(element.search("[/]") + "[/]".length, element.length)
				}

				answers.push(element)
			})

			shuffleOptions(answers)

			// creating instances of the questionnare cards
			let template = $("[questionnaire-card]")[0].content.cloneNode(true).children[0]
			let header = template.querySelector("header")
			template.setAttribute("id", i)

			header.querySelector("h6").textContent = `${questionnareNumber}. ${title}`
			let multioption = template.querySelector("multioption")

			answers.forEach((answ) => {
				// creating options
				const option = document.createElement(`option-${k}`)
				option.classList.add("card", "shadow-sm", "p-3")
				const text = document.createTextNode(answ)
				option.appendChild(text)

				multioption.appendChild(option)
				k++
			})

			$("content").append(template)
			questionnareNumber++
		}

		$("multioption *").click(function () {
			// toggle mark selected option
			if (!$(this).attr("selected")) $(this)[0].setAttribute("selected", "")
			else $(this)[0].removeAttribute("selected", "")

			$(this).toggleClass(`${DEFAULT_OPTION_CLASS} alert alert-primary m-0`)

			let hasAnswers = false
			$(this)
				.closest("multioption")
				.children()
				.each(function (i, element) {
					if ($(element.tagName).hasClass("alert")) {
						hasAnswers = true
						return
					}
				})

			let id = $(this).closest("card").attr("id")
			hasAnswers ? $(`#NavItem-${parseInt(id) + 1}`).addClass("active") : $(`#NavItem-${parseInt(id) + 1}`).removeClass("active")
		})

		$("#CheckAnswersBtn").click(function () {
			let score = 0

			$("form").each(function (i, form) {
				let selectedAnswers = []
				let correctAnswers = getCorrectAnswers(res, i)

				$(`card#${$(this).closest("card").attr("id")} [selected]`).each(function (i, e) {
					selectedAnswers.push(e.textContent)
				})

				let correct = []
				for (let i = 0; i < selectedAnswers.length; i++) {
					for (let j = 0; j < correctAnswers.length; j++) {
						if (selectedAnswers[i] === correctAnswers[j]) {
							correct.push(true)
							continue
						}
					}
				}
				// console.log(selectedAnswers, correct, correctAnswers) debug
				if (correct.length === getTotalAnswers(res, i)) score++
			})

			let percentageScore = (score / QUESTIONNAIRE_SIZE) * 100
			$("total-score").html(score)
			$("percentage-score").html(`${percentageScore}%`)

			if (percentageScore >= 75) {
				$("score-info i.fa").removeClass().addClass("fa fa-solid fa-check display-1 mb-2 text-success")
				$("score-info b span").html("You passed! You got a total of ")
				$("score-info percentage-score, score-info total-score, score-info total-items, score-info b").removeClass().addClass("text-success")

				passSfx.play()
			} else {
				$("score-info i.fa").removeClass().addClass("fa fa-solid fa-frown display-1 mb-2 text-danger")
				$("score-info b span").html("You failed! You got a total of ")
				$("score-info percentage-score, score-info total-score, score-info total-items, score-info b").removeClass().addClass("text-danger")

				failSfx.play()
			}
		})

		$("#ShowAnswersBtn").click(function () {
			for (let i = 0; i < QUESTIONNAIRE_SIZE; i++) {
				let correctAnswers = getCorrectAnswers(res, i)

				// checking if the form's <option> innerHTML is the same to the correct answer
				// if so, add a class correct
				$(`content #${i} multioption *`).each((i, option) => {
					correctAnswers.forEach((answ) => {
						if (option.textContent === answ) {
							$(option.tagName).addClass("correct")
						}
					})
				})
			}
			// all of those that have a correct class, will be colored
			$(".correct").removeClass().addClass(`${DEFAULT_OPTION_CLASS} alert alert-success m-0`)
		})

		$("#ResetBtn").click(function () {
			$("multioption *").removeClass().addClass(DEFAULT_OPTION_CLASS)
			$("multioption *").removeAttr("selected")

			$("score-info i.fa").removeClass().addClass("fa fa-solid fa-check display-1 mb-2")
			$("score-info b span").html("You got a total of ")
			$("score-info percentage-score, score-info total-score, score-info total-items, score-info b").removeClass("text-success text-danger")
			$("score-info percentage-score").html(`${0}%`)
			$("score-info total-score").html("?")

			for (let i = 1; i <= QUESTIONNAIRE_SIZE; i++) {
				$(`#NavItem-${i}`).removeClass("active")
			}
		})
	},
	error: function () {
		$("#ErrorModal").modal("show")
	},
})
