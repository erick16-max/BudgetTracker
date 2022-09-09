//getting the app 
const appSelector = document.getElementById('app')

//creatting a class for all the budget methods
class BudgetTracker {

    constructor(appSelector){
        //get the app dom
        this.app = appSelector;

        //loading the html
        this.app.innerHTML = BudgetTracker.tablehHtml()

        this.app.querySelector(".new-entry").addEventListener("click", () => {
           this.onNewEntryBtnClicked();
        })

       //loading that initially
        this.load();
        

    }

    //bring the actual table
    static tablehHtml(){
        return `
        <table class="budget-tracker">
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th></th>
            </tr>
        </thead>
        <tbody class="entries">
           
        </tbody>
        <tbody>
            <tr >
                <td colspan="5" class="controls">
                    <button class="new-entry" >New Entry</button>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr >
                <td colspan="5" class="summary">
                    <strong>Total:</strong>
                    <span class="total">KSH 0.00</span>
                </td>
            </tr>
        </tfoot>
    </table>
        `
    }

    //bring the row of the table
    static entryHtml() {
        return `
        <tr>
            <td>
                <input type="date" class="input input-date">
            </td>
            <td>
                <input type="text" class="input input-description" placeholder="bills, wages..">
            </td>
            <td>
                <select class="input input-type" >
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                </select>
            </td>
            <td>
                <input type="text" class="input input-amount">
            </td>
            <td>
                <button type="button" class="delete-entry">&#10005;</button>
            </td>
    </tr>
        `
    }

    //initial loading of the data
    load(){
        const entries = JSON.parse(localStorage.getItem("budget-tracker-entries") || "[]");

        for(const entry of entries){
            this.addEntry(entry)
        }
        this.updateSummary();

        
    }

    //display the current rows in the table
    updateSummary(){
        const total = this.getEntryRows().reduce((total, row) => {
            const amount = row.querySelector(".input-amount").value;
            const isExpense = row.querySelector(".input-type").value === "expense";
            const modifier = isExpense ? -1 : 1 ;

            return total + (amount * modifier);

        }, 0)
        const totalFormatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "KSH"
        }).format(total)
        this.app.querySelector(".total").textContent = totalFormatted
    }

    //save data to local storage
    save(){
        const data = this.getEntryRows().map(row => {
            return {
                date: row.querySelector(".input-date").value,
                description: row.querySelector(".input-description").value,
                type: row.querySelector(".input-type").value,
                amount: parseFloat(row.querySelector(".input-amount").value),
            }

        });
        localStorage.setItem("budget-tracker-entries", JSON.stringify(data));
        this.updateSummary();
    }

    //add new enntry of a raw
    addEntry(entry = {}) {
        this.app.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());

        const lastRow = this.app.querySelector(".entries tr:last-of-type");

        lastRow.querySelector(".input-date").value = entry.date || new Date().toISOString().replace(/T.*/, "");
        lastRow.querySelector(".input-description").value = entry.description || "";
        lastRow.querySelector(".input-type").value = entry.type || "income";
        lastRow.querySelector(".input-amount").value = entry.amount || 0;
        lastRow.querySelector(".delete-entry").addEventListener("click", e => {
            this.onDeleteBtnClicked(e)
        })

        lastRow.querySelectorAll(".input").forEach(input => {
            input.addEventListener("change", () => this.save());
        })
        

    }

    //get all the rows entered
    getEntryRows() {
        return Array.from(this.app.querySelectorAll(".entries tr"))
    }

    //when the new entry button is clicked
    onNewEntryBtnClicked(){
        this.addEntry();
    }

    //when the delete event button is clicked
    onDeleteBtnClicked(e){
       e.target.closest("tr").remove();
       this.save();
    }

}

new BudgetTracker(appSelector);