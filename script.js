
let table = document.querySelector('table');
let tbody = table.tBodies[0];
let addBtn = document.querySelectorAll('.add-btn');
let deleteBtn = document.querySelectorAll('.delete-btn');


let newOrChildDetailOption = document.querySelector('#new-or-child-detail');
let parentElementSelection = document.querySelector('.parent-element-select');
let addDetailForm = document.querySelector('.add-detail-form');
let parentDetailsList = document.querySelector('#avail-parent-details');

//initial table filling
renewTableData();

function renewTableData() {
    table = document.querySelector('table');
    console.log('RENEW!');
    tbody = table.tBodies[0];
    //calculate price on parent details
    for(let i = 0; i < tbody.rows.length; i++) {
        tbody.rows[i].cells[2].innerHTML = calculatePrice(tbody.rows[i]);
    }
    //cost assignment
    for(let i = 0; i < tbody.rows.length; i++) {
        let price = Number(tbody.rows[i].cells[2].innerHTML);
        let quantity = Number(tbody.rows[i].cells[3].innerHTML);
        tbody.rows[i].cells[4].innerHTML = price * quantity;
    }

    //working with buttons
    addBtn = document.querySelectorAll('.add-btn');
    deleteBtn = document.querySelectorAll('.delete-btn');

    addBtn.forEach(function(btn) {
        btn.onclick = function() {
            let costCell = btn.parentElement.previousElementSibling;
            let quantityCell = costCell.previousElementSibling;
            let priceCell = quantityCell.previousElementSibling;

            quantityCell.innerHTML = Number(quantityCell.innerHTML) + 1;
            costCell.innerHTML = Number(quantityCell.innerHTML) * Number(priceCell.innerHTML);
        }
    });

    deleteBtn.forEach(function(btn) {
        btn.onclick = function() {
            let costCell = btn.parentElement.previousElementSibling;
            let quantityCell = costCell.previousElementSibling;
            let priceCell = quantityCell.previousElementSibling;

            if(quantityCell.innerHTML > 0) {
                quantityCell.innerHTML = Number(quantityCell.innerHTML) - 1;
                costCell.innerHTML = Number(quantityCell.innerHTML) * Number(priceCell.innerHTML);
            }
        }
    });

    //adding new detail
    fillParentElementSelect();

}


function calculatePrice(row) {
    let originalPrice = row.cells[2].innerText;

    let beginning = row.cells[0].innerText;
    let regExp = new RegExp(`^${beginning}\\.[1-9]{1,}$`);
    let resPrice = 0;
    for(let i = row.rowIndex + 1; i < table.rows.length; i++) {
        let nextRow = table.rows[i];
        let nextRowIndex = nextRow.cells[0].innerText;
        if(regExp.test(nextRowIndex)) {
            let nextRowPrice = calculatePrice(nextRow);
            resPrice += Number(nextRowPrice);
            continue;
        }
    }
    if(resPrice == 0) return originalPrice;
    else return resPrice;
}


function fillParentElementSelect() {
    while(parentDetailsList.childElementCount != 1) {
        //console.log(parentDetailsList.lastElementChild);
        parentDetailsList.lastElementChild.remove();
    }
    for(let i = 0; i < tbody.rows.length; i++) {
        let parentDetailIndex = tbody.rows[i].cells[0].innerText;
        let parentDetailName = tbody.rows[i].cells[1].innerText;
        let parentDetail = document.createElement('option');
        parentDetail.setAttribute('value', `${parentDetailIndex}`);
        parentDetail.innerText = parentDetailName;
        parentDetailsList.appendChild(parentDetail);
    }
}

newOrChildDetailOption.addEventListener('change', showForm);

function showForm(event) {
    if(event.target.value == 'new-detail') {
        parentElementSelection.hidden = true;
        addDetailForm.hidden = false;
    }
    else if(event.target.value == 'sub-detail') {
        parentElementSelection.hidden = false;
        addDetailForm.hidden = false;
    }
    else {
        parentElementSelection.hidden = true;
        addDetailForm.hidden = true;
    }
}

let indexInfo;
parentDetailsList.addEventListener('change', function(event){
    indexInfo = assignDetailIndex(event);
});




let newDetailInputs = document.querySelectorAll('input');
let newDetailName = document.getElementById('name-input');
let newDetailPrice = document.getElementById('price-input');
let newDetailQuantity = document.getElementById('quantity-input');
let addNewDetailBtn = document.querySelector('.add-new-detail-btn');


addNewDetailBtn.addEventListener('click', addNewDetail);

function addNewDetail(event) {
    event.preventDefault();
    if(newDetailName.value.length >= 3 && 
        newDetailPrice.value.match(/^[1-9]\d{2,}/) != null &&
        newDetailQuantity.value.match(/\d+/) != null) {
        let detailRow = document.createElement('tr');
        let detailIndex = document.createElement('td');
        if(parentElementSelection.hidden) {
            detailIndex.innerText = assignDetailIndex();
        }
        else {
            detailIndex.innerText = indexInfo[0];
        }
        let detailName = document.createElement('td');
        detailName.innerText = newDetailName.value;
        let detailPrice = document.createElement('td');
        detailPrice.innerText = newDetailPrice.value;
        let detailQuantity = document.createElement('td');
        detailQuantity.innerText = newDetailQuantity.value;
        let detailCost = document.createElement('td');
        let detailActions = document.createElement('td');
        let detailAddBtn = document.createElement('button');
        let detailDeleteBtn = document.createElement('button');
        detailAddBtn.classList.add('add-btn');
        detailAddBtn.setAttribute('type', 'button');
        detailAddBtn.innerText = 'Добавить';
        detailDeleteBtn.classList.add('delete-btn');
        detailDeleteBtn.setAttribute('type', 'button');
        detailDeleteBtn.innerText = 'Удалить';

        detailRow.appendChild(detailIndex);
        detailRow.appendChild(detailName);
        detailRow.appendChild(detailPrice);
        detailRow.appendChild(detailQuantity);
        detailRow.appendChild(detailCost);
        detailActions.appendChild(detailDeleteBtn);
        detailActions.appendChild(detailAddBtn);
        detailRow.appendChild(detailActions);
        
        if(parentElementSelection.hidden) {
            tbody.appendChild(detailRow);
        }
        else {
            tbody.rows[indexInfo[1]].insertAdjacentElement('afterend', detailRow);
        }

        newDetailName.value = '';
        newDetailPrice.value = '100';
        newDetailQuantity.value = '1';
        renewTableData();
        newOrChildDetailOption.value = 'empty';
        parentElementSelection.hidden = true;
        addDetailForm.hidden = true;
    }
    
}

function assignDetailIndex(event) {
    if(parentElementSelection.hidden) {
        for(let i = tbody.rows.length - 1; i > 0; i--) {
            let regExp = new RegExp('^[1-9]+$');
            if(regExp.test(tbody.rows[i].cells[0].innerHTML)) {
                let newIndex = Number(tbody.rows[i].cells[0].innerHTML) + 1;
                return newIndex.toString();
            }
        }
        return '1';
    }
    else {
        let newSubDetailIndex, adjacentRowIndex = 0;
        for(let i = tbody.rows.length - 1; i > 0; i--) {
            let beginning = event.target.value;
            if(tbody.rows[i].cells[0].innerText == beginning) {
                adjacentRowIndex = i;
            }
            let regExp = new RegExp(`^${beginning}\\.[1-9]+$`);
            if(regExp.test(tbody.rows[i].cells[0].innerText)) {
                let lastIndex = tbody.rows[i].cells[0].innerText.match(/[1-9]+$/);
                newSubDetailIndex = beginning + '.' + String(Number(lastIndex) + 1);
                console.log(newSubDetailIndex);
                let regExp = new RegExp(`^${beginning}\\.[1-9]+`);
                let childIndex = i+1;
                while(true) {
                    if(!tbody.rows[childIndex].cells[0].innerText.match(regExp)) {
                        console.log([newSubDetailIndex, childIndex-1]);
                        return [newSubDetailIndex, childIndex-1];
                    }
                    childIndex += 1;
                    console.log(childIndex);
                }
            }
        }
        newSubDetailIndex = event.target.value + '.1';
        console.log([newSubDetailIndex, adjacentRowIndex]);
        return [newSubDetailIndex, adjacentRowIndex];
    }
}



function tableToExcel(filename) {
    let tableElement = document.getElementById('details-table');
    let workbook = XLSX.utils.table_to_book(tableElement, {sheet:"Sheet JS"});
    return XLSX.writeFile(workbook, filename + '.xlsx');

}