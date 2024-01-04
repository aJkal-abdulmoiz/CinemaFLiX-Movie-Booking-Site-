// Function to retrieve users from local storage
function getUsersFromStorage() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users;
}

// Convert image to Data URL
function getBase64Image(url, callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0);

    const dataURL = canvas.toDataURL('image/jpeg'); // or 'image/png'
    callback(dataURL);
  };
  img.src = url;
}

document.addEventListener('DOMContentLoaded', function () {
  const bookButtons = document.querySelectorAll('.book-btn');

  bookButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      const movieTitle = this.parentNode.querySelector('h4').textContent;
      const movieImgElement = this.closest('.movie-card').querySelector('.movie-img img');

      if (movieImgElement) {
        const movieImgSrc = movieImgElement.src;

        localStorage.setItem('selectedMovie', JSON.stringify({ movieTitle, movieImgSrc }));
        let usersData = getUsersFromStorage(); // Get all users from storage

        let loggedInUser;
        for (const user of usersData) {
          if (user.isLoggedIn) {
            loggedInUser = user;
            break;
          }
        }

        if (!loggedInUser) {
          // If no logged-in user found, prompt to login first
          showAlert('Please log in first.');
          window.location.href = 'login.html'; // Redirect to login page
          return; // Stop further execution
        }

        loggedInUser.bookings = loggedInUser.bookings || [];
        // Check if the movie is already booked
        const alreadyBooked = loggedInUser.bookings.some(booking => booking.movie === movieTitle);
        if (!alreadyBooked) {
          window.location.href = 'seating.html'; // Redirect to the bookings page
        } else {
          showAlert('You have already booked this movie.'); // Alert if the movie is already booked
        }
      } else {
        console.error('Movie image not found.');
      }
    });
  });

  // Display bookings if a logged-in user is found
  const users = getUsersFromStorage();
  const loggedInUser = users.find(user => user.isLoggedIn);
  

  if (loggedInUser) {
    const userBookingsContainer = document.querySelector('.book-container');
    const bookings = loggedInUser.bookings || [];
    
    if (bookings.length === 0) {
      showAlert('You have no bookings. Please book a movie.');
    }
    else{
      bookings.forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.classList.add('booking-item');
        bookingItem.classList.add('booking-layout');
         // Extracting booking details
        const { image, movie, seats, time, date, price } = booking; 
  
        // Movie Image
        const movieImage = document.createElement('img');
        movieImage.src = image; // Assuming the image source is stored in the booking object
        movieImage.classList.add('booking-image');
  
        // Booking Details Container
        const bookingDetails = document.createElement('div');
        bookingDetails.classList.add('booking-details');
  
        // Movie Title
        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie;
        movieTitle.classList.add('booking-title');
            
            // Button for removing booking
        const removeButton = document.createElement('button');
        removeButton.textContent = 'x';
        removeButton.classList.add('remove-button');
  
        removeButton.addEventListener('click', function () {
          // Find the index of the current booking to remove
          const bookingIndex = loggedInUser.bookings.findIndex(b => b.movie === movie);
  
          if (bookingIndex !== -1) {
            // Remove the booking from the array
            loggedInUser.bookings.splice(bookingIndex, 1);
  
            // Update the user's data in the users array
            users[loggedInUser] = loggedInUser;
  
            // Update local storage with the modified user data
            localStorage.setItem('users', JSON.stringify(users));
  
            // Remove the booking item from the document
            bookingItem.remove();
          }
        });
  
        // Append the remove button to the booking details container
        bookingDetails.appendChild(removeButton);
  
        const ticketBooker = document.createElement('h3');
        ticketBooker.textContent = `Booked by: ${loggedInUser.username}`; // Using the username from the logged-in user
        ticketBooker.classList.add('ticket-booker');
  
        const bookingDate = document.createElement('p');
        bookingDate.textContent = `Date: ${date}`;
        bookingDate.classList.add('booking-date');
  
        const bookingTime = document.createElement('p');
        bookingTime.textContent = `Time: ${time}`;
        bookingTime.classList.add('booking-time');
  
        const bookingPrice = document.createElement('h4');
        bookingPrice.textContent = `Price: ${price}`;
        bookingPrice.classList.add('booking-price');
  
        const bookedSeats = document.createElement('p');
        bookedSeats.textContent = `Seats: ${seats.join(', ')}`;
        bookedSeats.classList.add('booking-seats');
  
        // Button for printing
        const printButton = document.createElement('button');
        printButton.textContent = 'Download';
        printButton.classList.add('print-button');
  
        
        printButton.addEventListener('click', function () {
          createBookingPDF(movie, image, seats, time, date, loggedInUser.username, price);
        });
        
  
        // Append elements to the booking details container
        bookingDetails.appendChild(movieTitle);
        bookingDetails.appendChild(ticketBooker);
        bookingDetails.appendChild(bookingDate);
        bookingDetails.appendChild(bookingTime);
        bookingDetails.appendChild(bookedSeats);
        bookingDetails.appendChild(bookingPrice);
        bookingDetails.appendChild(printButton);
  
  
        // Append elements to the booking item
        bookingItem.appendChild(movieImage);
        bookingItem.appendChild(bookingDetails);
  
        userBookingsContainer.appendChild(bookingItem);
      });

    }

   
  } else {
    console.log('No logged-in user found.');
    // Handle if no logged-in user is found
  }
});


// Function to handle seat selection
let selectedSeats = [];
const seatElements = document.querySelectorAll(".seat");
seatElements.forEach((seat) => {
  seat.addEventListener("click", () => {
    seat.classList.toggle("selected");
    const seatId = seat.id;
    if (selectedSeats.includes(seatId)) {
      selectedSeats = selectedSeats.filter((id) => id !== seatId);
    } else {
      selectedSeats.push(seatId);
    }
    updatePrice(); // Update price when seat selection changes
  });
});

// Function to calculate and display total price
function updatePrice() {
  const ticketPrice = 200; // Price per seat
  const totalPrice = selectedSeats.length * ticketPrice;
  const priceElement = document.querySelector(".amount");
  priceElement.textContent = totalPrice;
}
// Function to handle booking confirmation
const DoneBtns = document.querySelectorAll(".done");
DoneBtns.forEach(DoneBtn => {
  DoneBtn.addEventListener('click', () => {
    const selectedTime = document.querySelector("[name='time']:checked + label").textContent.trim();
    // Check for seat selection and time
    if (selectedSeats.length === 0 || !selectedTime) {
      showAlert('Please select a seat and time to Proceed!');
      return;
    }

    const totalPrice = parseInt(document.querySelector(".amount").textContent); // Get the total price
    const selectedDate = document.querySelector("[name='date']:checked + .dates-item .date").textContent;
    const selectedDay = document.querySelector("[name='date']:checked + .dates-item .day").textContent; // Get the selected date
    const f_date =selectedDay+" "+selectedDate;

    // Retrieve movie details from localStorage
    const selectedMovie = JSON.parse(localStorage.getItem('selectedMovie'));

    if (selectedMovie) {
      const { movieTitle, movieImgSrc } = selectedMovie;
      const usersData = getUsersFromStorage();
      const loggedInUserIndex = usersData.findIndex(user => user.isLoggedIn);

      if (loggedInUserIndex !== -1) {
        const loggedInUser = usersData[loggedInUserIndex];
        loggedInUser.bookings = loggedInUser.bookings || [];
        loggedInUser.bookings.push({ movie: movieTitle, image: movieImgSrc, seats: selectedSeats,date: f_date, time: selectedTime, price: totalPrice });
        // Update the specific user's data in the users array
        usersData[loggedInUserIndex] = loggedInUser;

        localStorage.setItem('users', JSON.stringify(usersData)); // Update user's bookings

        createBookingPDF(movieTitle, movieImgSrc, selectedSeats, f_date, selectedTime, loggedInUser.username, totalPrice);

      }
    }

    // Clear temporary movie details from localStorage
    localStorage.removeItem('selectedMovie');

    // Redirect to bookings.html or any other desired page
    window.location.href = 'booking.html';
  });
});

function createBookingPDF(movieTitle, movieImgSrc, selectedSeats, selectedTime, f_date, bookerName, totalPrice) {
  getBase64Image(movieImgSrc, function (dataURL) {
    const docDefinition = {
      pageSize: 'A5', // A4 size paper
      pageOrientation: 'landscape', // Landscape orientation
      content: [
        {
          columns: [
            // Movie Image
            { image: dataURL, width: 400, height: 200, margin: [0, 0, 20, 0] }, // Adjust width as needed

            // Movie Details
            {
              stack: [
                { text: `${movieTitle}`, fontSize: 20, margin: [5, 0, 0, 10] },
                { text: `User Id: ${bookerName}`, fontSize: 16, margin: [15, 0, 0, 10] },
                { text: `Date: ${f_date}`, fontSize: 16, margin: [15, 0, 0, 10] },
                { text: `Time: ${selectedTime}`, fontSize: 16, margin: [15, 0, 0, 10] },
                { text: `Seats: ${selectedSeats.join(', ')}`, fontSize: 16, margin: [15, 0, 0, 10] },
                { text: `Price: ${totalPrice}`, fontSize: 16, margin: [15, 0, 0, 10] },

                { text: "CinemaFLIX", fontSize: 16, margin: [30, 120, 0, 10] },
               
              ],
              width: '*',
            },
          ],
        },
      ],
    };

    pdfMake.createPdf(docDefinition).download(`${movieTitle}_Ticket.pdf`);
  });
}


function showAlert(message) {
  var alertBox = document.getElementById('myAlert');
  alertBox.textContent = message;
  alertBox.style.display = 'block';
  setTimeout(function() {
      alertBox.style.display = 'none';
  }, 3000);
}