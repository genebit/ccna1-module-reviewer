$.ajax({
	url: "/resources/data.json",
	dataType: "json",
	success: function (res) {
		let number = 1

		for (let i = 0; i < res["QUESTIONS"].length; i++) {
			let title = res["QUESTIONS"][i].TITLE

			let template = $("[questionnaire-card]")[0].content.cloneNode(true).children[0]
			let header = template.querySelector("header")
			template.setAttribute("id", i)

			header.querySelector("h6").textContent = `${number}. ${title}`
			let multioption = template.querySelector("multioption")

			let answers = []
			let correct_answers = []

			// getting and assigning the data for each element
			res["QUESTIONS"][i].ANSWERS.forEach((element) => {
				// if the word correct exist
				if (element.includes("[/]")) {
					element = element.substring(element.search("[/]") + "[/]".length, element.length)
					correct_answers.push(element)
				}

				answers.push(element)
			})

			answers.forEach((answ, index) => {
				const node = document.createElement(`option-${index}`)
				node.classList.add("card", "shadow-sm", "p-3")
				const textnode = document.createTextNode(answ)
				node.appendChild(textnode)

				multioption.appendChild(node)
			})

			$("content").append(template)
			number++
		}

		$("#CheckAnswersBtn").click(function () {
			// loop through each card
			// get the multioption selected answers
			// if the selected answers is found within the array of correct answers
		})

		$("#ShowAnswersBtn").click(function () {
			$("content card").each(function (index, element) {
				$(`#${element.id} multioption *`)
					.siblings()
					.each(function (i, e) {
						console.log(e)
					})
			})
		})

		$("multioption *").click(function () {
			let clickedValue = $(this).html()
			$(this).toggleClass("alert alert-primary m-0")
		})
	},
})
