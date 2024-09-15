const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function validation() {

        let name = document.forms['signup_con']['username'].value;
        let email = document.forms['signup_con']['email'].value;
        let password = document.forms['signup_con']['password'].value;
        let mobile = document.forms['signup_con']['mob'].value;
        let flag=0;
        if (!(/^[a-zA-Z\s]+$/.test(name))) {
            alert('Name must conatin only alphabets');
            flag=1;
            return false;
        }
        else if (!(email.includes('@')) || !(email.includes('.'))) {
            alert('Enter a valid email id');
            flag=1;
            return false;
        }
        let pass_regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;

        if (!(pass_regex.test(password))) {
            alert('Password Must Contain atleast\n1 special character\n1 upperCase\n1 lowerCase\nlength must be atleast 8');
            flag=1;
            return false;
        }
        else if (isNaN(mobile) || mobile.length > 10 || mobile.length < 10) {
            alert('Enter valid Mobile Number')
            flag=1;
            return false;
        }
        if(flag==1){
            document.location.href = "/";
        }

        if(flag==0){
            document.getElementById('signup_con').submit();
            return true;
        }
}

