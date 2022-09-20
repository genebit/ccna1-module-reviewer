$.ajax({
	dataType: "json",
	url: "data.json",
	success: function (res) {
		let number = 1
		for (let i = 0; i < res["QUESTIONS"].length; i++) {
			let title = res["QUESTIONS"][i].TITLE

			let template = $("[questionnaire-card]")[0].content.cloneNode(true).children[0]
			let header = template.querySelector("header")
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

			answers.forEach((element, i) => {
				const node = document.createElement(`option_${i}`)
				node.classList.add("card", "shadow-sm", "p-3")
				node.setAttribute("value", element)
				const textnode = document.createTextNode(element)
				node.appendChild(textnode)
				multioption.appendChild(node)
			})

			$("content").append(template)
			number++
		}
		$("multioption *").click(function () {
			let clickedValue = $(this).val()
			if ($(this).hasClass("alert")) {
				$(this).removeClass().addClass("card shadow-sm p-3")
			} else {
				$(this).removeClass().addClass("alert alert-primary shadow-sm p-3 m-0")
			}
		})
	},
})
