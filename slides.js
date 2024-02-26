var slideIndex = 1;
			showDivs(slideIndex);
			// Function to add 1 to the slideIndex
			function plusDivs(n) {
				showDivs(slideIndex += n);
			}
			// Function that will be called onclick, setting the slideIndex to n
			function currentDiv(n) {
				showDivs(slideIndex = n);
			}

			// Function that changes the display of previous slides and next slides
			// i need a function that changes the href depending on the div count. so div 1 href will be this
			function showDivs(n) {
				var i;
				// gets all the element with myslides
				var x = document.getElementsByClassName("mySlides");
				var dots = document.getElementsByClassName("demo");
				var link = document.getElementsByClassName("slides-info");
  			// If slideIndex surpasses the number of mySlides, return slideIndex to 1
  			if (n > x.length) {slideIndex = 1}
  			if (n > link.length) {slideIndex = 1}
  			// If slideIndex is less than 1, set slideIndex equal to number of mySlides
  			if (n < 1) {slideIndex = x.length}
  			if (n < 1) {slideIndex = link.length}
  			// If x is less than x length, add 1 to the i variable. Set display as none for the past slide
  			for (i = 0; i < x.length; i++) {
  			  x[i].style.display = "none";
  			}
  			for (i = 0; i < link.length; i++) {
  			  link[i].style.display = "none";
  			}
  			// Same with the slide indicator
  			for (i = 0; i < dots.length; i++) {
  			  dots[i].className = dots[i].className.replace(" active-slide", "");
  			}
  			x[slideIndex-1].style.display = "block";  
  			link[slideIndex-1].style.display = "block"; 
  			dots[slideIndex-1].className += " active-slide";
			}