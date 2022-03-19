import VerticalLayout from './VerticalLayout.js'

export default () => {
  // Added data-testid="btn-send-bill" to the submit button.
  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Send a fee </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill">
            <div class="row">
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="expense-type" class="bold-label">Category of expense</label>
                      <select required class="form-control blue-border" data-testid="expense-type">
                        <option>Travels</option>
                        <option>Food</option>
                        <option>Hostel</option>
                        <option>Online services</option>
                        <option>IT products and electronics</option>
                        <option>Equipment</option>
                        <option>Furnitures</option>
                      </select>
                  </div>
                  <div class="col-half">
                    <label for="expense-name" class="bold-label">Label of expense</label>
                    <input type="text" class="form-control blue-border" data-testid="expense-name" placeholder="London-Paris flight" />
                  </div>
                  <div class="col-half">
                    <label for="datepicker" class="bold-label">Date</label>
                    <input required type="date" class="form-control blue-border" data-testid="datepicker" />
                  </div>
                  <div class="col-half">
                    <label for="amount" class="bold-label">Amount all taxes incl. </label>
                    <input required type="number" class="form-control blue-border input-icon input-icon-right" data-testid="amount" placeholder="348"/>
                  </div>
                  <div class="col-half-row">
                    <div class="flex-col"> 
                      <label for="vat" class="bold-label">VAT</label>
                      <input type="number" class="form-control blue-border" data-testid="vat" placeholder="70" />
                    </div>
                    <div class="flex-col">
                      <label for="pct" class="white-text">%</label>
                      <input required type="number" class="form-control blue-border" data-testid="pct" placeholder="20" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="commentary" class="bold-label">Comments</label>
                    <textarea class="form-control blue-border" data-testid="commentary" rows="3"></textarea>
                  </div>
                  <div class="col-half">
                    <label for="file" class="bold-label">Fee</label>
                    <input required type="file" class="form-control blue-border" data-testid="file" />
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill' data-testid="btn-send-bill" class="btn btn-primary">Send</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
  // ^^^^^
}