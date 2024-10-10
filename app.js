

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0v8Jz4rD59t_iA_YHxbudFprAxhgQkCU",
    authDomain: "login-poc-otp.firebaseapp.com",
    projectId: "login-poc-otp",
    storageBucket: "login-poc-otp.appspot.com",
    messagingSenderId: "622369715181",
    appId: "1:622369715181:web:d6099eb626fb03c2146de4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Recaptcha setup
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'normal',
    'callback': function(response) {
        console.log("Recaptcha Verified");
    },
    'expired-callback': function() {
        console.error("Recaptcha Expired");
    }
});

// Send OTP
document.getElementById('send-otp-btn').addEventListener('click', () => {
    const phoneNumber = document.getElementById('phone-number').value;
    const appVerifier = window.recaptchaVerifier;

    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            console.log("OTP sent");
            // Show the OTP input field and Verify button
            document.getElementById('otp').style.display = "block";
            document.getElementById('verify-otp-btn').style.display = "block";
        }).catch((error) => {
            console.error("Error sending OTP:", error);
        });
});

// Verify OTP
document.getElementById('verify-otp-btn').addEventListener('click', () => {
    const otp = document.getElementById('otp').value;

    confirmationResult.confirm(otp).then((result) => {
        const user = result.user;
        console.log("User signed in:", user);

        // Store the user info in Firestore
        db.collection('users').doc(user.uid).set({
            phoneNumber: user.phoneNumber,
            createdAt: new Date()
        }).then(() => {
            console.log('User data stored in Firestore');
        });

    }).catch((error) => {
        console.error("Error verifying OTP:", error);
    });
});
