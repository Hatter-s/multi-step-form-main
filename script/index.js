//util
const capitalizeAndRemoveMinus = (text) => {
  //capitalize
  let capText = text[0].toUpperCase().concat(text.slice(1,));

  //replace minus to space
  let texts = capText.split('-').join(' ');
  return texts;
}

//HANDLER WHICH STEP WHAT USER IN
let step = 1; //alway start at 1

//functional use to change step
const functionalButton = document.querySelector('.functional-button')

const next = document.querySelector('.functional-button .next');
const back = document.querySelector('.functional-button .back');
const submit = document.querySelector('.functional-button .submit');
const change = document.querySelector('.double-check .plan .change');

next.onclick = () => {
  step++;
  checkStep(step);
}

submit.onclick = () => {
  step++;
  checkStep(step);
}

back.onclick = () => {
  step--;
  checkStep(step);
}

change.onclick = () => {
  step = 2;
  checkStep(step);
}

//Call all step
const stepELements = document.querySelectorAll('#content .step');
const sidebarStep = document.querySelectorAll('#sidebar .step');
const maxStep = stepELements.length;

//FUNCTION check which step user in
const checkStep = (step) => {
  if (step === 1) {
    next.classList.remove('hidden');
    back.classList.add('hidden');

    functionalButton.classList.add('flex-end');
    functionalButton.classList.remove('flex-between');

  } else if (step === 4) {
    next.classList.add('hidden');
    submit.classList.remove('hidden');

    functionalButton.classList.remove('flex-end');
    functionalButton.classList.add('flex-between');

    checkTotal();
  } else if (step === maxStep) {
    back.classList.add('hidden');
    next.classList.add('hidden');
    submit.classList.add('hidden');

  } else {
    back.classList.remove('hidden');
    submit.classList.add('hidden');
    next.classList.remove('hidden');

    functionalButton.classList.remove('flex-end');
    functionalButton.classList.add('flex-between');

    removeAddOnElementInDoubleCheck()
  }

  sidebarStep.forEach(node => {
    const id = Number(node.attributes['step-id'].value);
    const element = node.querySelector('p.number');

    if (id === step) {
      element.classList.add('active');
    }
    else {
      element.classList.remove('active');
    }
  })

  stepELements.forEach(node => {
    const id = Number(node.attributes['step-id'].value);

    if (id === step) {
      if (step === maxStep) {
        node.classList.add('show-flex');
      } else {
        node.classList.add('show');
      }
      node.classList.remove('hidden');
    }
    else {
      node.classList.add('hidden');
      if (step === maxStep) {
        node.classList.remove('show-flex');
      } else {
        node.classList.remove('show');
      }
    }
  });

}

checkStep(step);

//HANDLER USER TYPE TO INPUT OR NOT

const typeInput = document.querySelectorAll('input:is([type="text"], [type="email"], [type="tel"])');

typeInput.forEach(node => node.addEventListener('blur', (e) => {
  const id = e.path[0].id;
  const requiredElement = document.querySelector(`label[for=${id}]+.required`);

  if (e.path[0].value === '') {
    e.path[0].classList.add('required');
    requiredElement.classList.add('display');
  }
}))

typeInput.forEach(node => node.addEventListener('input', (e) => {
  const id = e.path[0].id;
  const requiredElement = document.querySelector(`label[for=${id}]+.required`);

  if (e.path[0].value !== '') {
    e.path[0].classList.remove('required');
    requiredElement.classList.remove('display');
  }
}))

//HANDLE choose plan

let plan = 'monthly';
const changePlanButtons = document.querySelectorAll('.choose-plan label');
const changePlanToggle = document.querySelector('.choose-plan .toggle-switch .slider');

const planData = {
  monthly: {
    arcade: {
      subtitle: '$9/mo',
      deal: '',
      value: 9
    },
    advanced: {
      subtitle: '$12/mo',
      deal: '',
      value: 12
    },
    pro: {
      subtitle: '$15/mo',
      deal: '',
      value: 15
    },
    addOn: {
      'customizable-profile': '+$2/mo',
      'online-service': '+$1/mo',
      'larger-storage': '+$2/mo'
    },
    addOnVal: {
      'customizable-profile': 2,
      'online-service': 1,
      'larger-storage': 2
    }
  },
  yearly: {
    arcade: {
      subtitle: '$90/yr',
      deal: '2 months free',
      value: 90
    },
    advanced: {
      subtitle: '$120/yr',
      deal: '2 months free',
      value: 120
    },
    pro: {
      subtitle: '$150/yr',
      deal: '2 months free',
      value: 150
    },
    addOn: {
      'customizable-profile': '+$20/yr',
      'online-service': '+$10/yr',
      'larger-storage': '+$20/yr'
    },
    addOnVal: {
      'customizable-profile': 20,
      'online-service': 10,
      'larger-storage': 20
    }
  }
}

const planElement = document.querySelector('.form-control.plan');

const arcade = {
  subtitle: planElement.querySelector('label[for=arcade] .subtitle'),
  deal: planElement.querySelector('label[for=arcade] .deal')
};

const advanced = {
  subtitle: planElement.querySelector('label[for=advanced] .subtitle'),
  deal: planElement.querySelector('label[for=advanced] .deal')
};

const pro = {
  subtitle: planElement.querySelector('label[for=pro] .subtitle'),
  deal: planElement.querySelector('label[for=pro] .deal')
}

const addOns = document.querySelectorAll('.form-control.add-on label');

const setPlan = (plan) => {
  Object.values(arcade).forEach(node => {
    node.innerHTML = planData[plan]['arcade'][node.className];
  });

  Object.values(advanced).forEach(node => {
    node.innerHTML = planData[plan]['advanced'][node.className];
  });

  Object.values(pro).forEach(node => {
    node.innerHTML = planData[plan]['pro'][node.className];
  })

  addOns.forEach(node => {
    const service = node.getAttribute('for');
    const price = node.querySelector('.price');
    price.innerHTML = planData[plan]['addOn'][service];
  })
}

setPlan(plan);

changePlanButtons.forEach(node => {
  node.onclick = () => {
    plan = node.getAttribute('for');

    changePlanToggle.setAttribute('class', `slider ${plan}`);

    setPlan(plan);
  }
})

//handle way to cal total and call total

//double check element
const doubleCheckList = document.querySelector('.double-check .list');
const planChooseTitle = document.querySelector('.double-check .plan .title');
const planPrice = document.querySelector('.double-check .plan .price');

const totalTitle = document.querySelector('.double-check .total .text');

const totalPrice = document.querySelector('.double-check .total .price');

const planInput = document.querySelectorAll('.plan input');

const addOnsInput = document.querySelectorAll('.add-on input');

const createAddOnElementToDoubleCheck = (name, price) => {
  const addOnElement = document.createElement('div');
  addOnElement.classList.add('add-on');

  addOnElement.innerHTML = `
    <p class="s">${capitalizeAndRemoveMinus(name)}</p>

    <p class="price">${capitalizeAndRemoveMinus(price)}</p>
  `

  return addOnElement;
}

const removeAddOnElementInDoubleCheck = () => {
  const addOnList = document.querySelectorAll('.double-check .list .add-on');

  if (addOnList.length !== 0) {
    addOnList.forEach(node => node.remove());
  }
}

const checkTotal = () => {
  let namePlan = '';
  let allPrice = 0;
  planInput.forEach(node => {
    if (node.checked) {
      namePlan = node.id;
      allPrice += planData[plan][namePlan]['value'];
    };
  });

  addOnsInput.forEach(node => {
    if (node.checked) {
      const name = node.getAttribute('name');
      doubleCheckList.appendChild(createAddOnElementToDoubleCheck(name, planData[plan]['addOn'][name]));

      allPrice += planData[plan]['addOnVal'][name];
    }
  })

  planChooseTitle.innerHTML = `${capitalizeAndRemoveMinus(namePlan)} (${capitalizeAndRemoveMinus(plan)})`;
  planPrice.innerHTML = planData[plan][namePlan]['subtitle'];

  totalTitle.innerHTML = `Total (per ${plan.slice(0, -2)})`;

  totalPrice.innerHTML = `+$${allPrice}/${plan === 'monthly' ? 'mo' : 'yr'}`;
}