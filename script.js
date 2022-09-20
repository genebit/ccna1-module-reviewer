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

$.ajax({
	dataType: "json",
	url: "resources/data.json",
	success: function (res) {
		const QUESTIONNAIRE_SIZE = res["QUESTIONS"].length
		const DEFAULT_OPTION_CLASS = "card shadow-sm p-3"
		let questionnareNumber = 1,
			k = 1

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
				if (element.includes("[/]")) element = element.substring(element.search("[/]") + "[/]".length, element.length)

				answers.push(element)
			})

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
		})
	},
	error: function () {
		$("#ErrorModal").modal("show")
	},
})
