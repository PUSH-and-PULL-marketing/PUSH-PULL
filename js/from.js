const form = document.getElementById('modernForm');

const nameInput = document.getElementById('userName');
const emailInput = document.getElementById('userEmail');

const customSelect = document.getElementById('customSelect');
const selectTrigger = document.getElementById('selectTrigger');
const selectOptions = document.getElementById('selectOptions');
const selectedText = document.getElementById('selectedText');

const successMessage = document.getElementById('successMessage');

let selectedValue = '';

// OPEN / CLOSE DROPDOWN

selectTrigger.addEventListener('click', () => {
  customSelect.classList.toggle('open');
});

// SELECT OPTION

document.querySelectorAll('.select-option').forEach(option => {
  option.addEventListener('click', () => {
    selectedValue = option.dataset.value;

    selectedText.textContent = option.textContent.trim();
    selectedText.style.color = '#222';

    customSelect.classList.remove('open');

    customSelect.closest('.form-group').classList.remove('error');
  });
});

// CLOSE DROPDOWN WHEN CLICKING OUTSIDE

document.addEventListener('click', e => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove('open');
  }
});

// REMOVE ERRORS WHILE TYPING

nameInput.addEventListener('input', () => {
  nameInput.closest('.form-group').classList.remove('error');
});

emailInput.addEventListener('input', () => {
  emailInput.closest('.form-group').classList.remove('error');
});

// VALIDATE EMAIL

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// FORM SUBMIT

form.addEventListener('submit', e => {
  e.preventDefault();

  let isValid = true;

  // NAME

  if (nameInput.value.trim() === '') {
    nameInput.closest('.form-group').classList.add('error');
    isValid = false;
  } else {
    nameInput.closest('.form-group').classList.remove('error');
  }

  // EMAIL

  if (!isValidEmail(emailInput.value.trim())) {
    emailInput.closest('.form-group').classList.add('error');
    isValid = false;
  } else {
    emailInput.closest('.form-group').classList.remove('error');
  }

  // DROPDOWN

  if (selectedValue === '') {
    customSelect.closest('.form-group').classList.add('error');
    isValid = false;
  } else {
    customSelect.closest('.form-group').classList.remove('error');
  }

  // SUCCESS

  if (isValid) {
    successMessage.classList.add('show');

    // CLEAR INPUTS

    form.reset();

    selectedValue = '';
    selectedText.textContent = 'Выберите вариант';
    selectedText.style.color = '#999';

    customSelect.classList.remove('open');

    // HIDE SUCCESS AFTER 4 SECONDS

    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 4000);
  }
});
