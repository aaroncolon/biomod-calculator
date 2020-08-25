import React from "react";

class BioModForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      wasteWaterFlow         : 50000,
      bodConcentrationBefore : 2500,
      bodLbsBefore           : 0,
      bodTreatmentSurcharge  : 2,
      dailyBillBefore        : 0,
      monthlyBillBefore      : 0,
      bodRemovalEfficiency   : 85,
      bodConcentrationAfter  : 0,
      bodLbsAfter            : 0,
      dailyBillAfter         : 0,
      monthlyBillAfter       : 0,
      totalSavings           : 0,
      totalSavingsPercent    : 0
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.calcValues()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // ensure the component's state has updated before calculating the respective values
    if (this.state.wasteWaterFlow !== prevState.wasteWaterFlow
        || this.state.bodConcentrationBefore !== prevState.bodConcentrationBefore
        || this.state.bodTreatmentSurcharge !== prevState.bodTreatmentSurcharge
        || this.state.bodRemovalEfficiency !== prevState.bodRemovalEfficiency) {
      this.calcValues()
    }
  }

  handleChange(e) {
    const id  = e.target.id
    const val = e.target.value

    switch (id) {
      case 'waste-water-flow':
        this.setState({
          wasteWaterFlow: val
        })
        break
      case 'bod-concentration':
        this.setState({
          bodConcentrationBefore: val
        })
        break
      case 'bod-treatment-surcharge':
        this.setState({
          bodTreatmentSurcharge: val
        })
        break
      case 'bod-removal-efficiency':
        this.setState({
          bodRemovalEfficiency: val
        })
      default:
        break
    }
  }

  calcValues() {
    const bodLbsBefore          = this.calcBodLbsBefore()
    const dailyBillBefore       = this.calcDailyBillBefore(bodLbsBefore)
    const monthlyBillBefore     = this.calcMonthlyBillBefore(dailyBillBefore)
    const bodConcentrationAfter = this.calcReducedBodConcentration()
    const bodLbsAfter           = this.calcBodLbsAfter(bodConcentrationAfter)
    const dailyBillAfter        = this.calcDailyBillAfter(bodLbsAfter)
    const monthlyBillAfter      = this.calcMonthlyBillAfter(dailyBillAfter)
    const totalSavings          = this.calcTotalSavings(monthlyBillBefore, monthlyBillAfter)
    const totalSavingsPercent   = this.calcTotalSavingsPercent(monthlyBillBefore, totalSavings)

    this.setState({
      bodLbsBefore,
      dailyBillBefore,
      monthlyBillBefore,
      bodConcentrationAfter,
      bodLbsAfter,
      dailyBillAfter,
      monthlyBillAfter,
      totalSavings,
      totalSavingsPercent
    })
  }

  calcBodLbsBefore() {
    return this.state.bodConcentrationBefore * (this.state.wasteWaterFlow / 1000000) * 8.34
  }

  calcDailyBillBefore(bodLbsBefore) {
    return bodLbsBefore * this.state.bodTreatmentSurcharge
  }

  calcMonthlyBillBefore(dailyBillBefore) {
    return dailyBillBefore * 30
  }

  calcReducedBodConcentration() {
    return this.state.bodConcentrationBefore - (this.state.bodConcentrationBefore * this.convertPercentForCalc(this.state.bodRemovalEfficiency))
  }

  calcBodLbsAfter(bodConcentrationAfter) {
    return bodConcentrationAfter * (this.state.wasteWaterFlow / 1000000) * 8.34
  }

  calcDailyBillAfter(bodLbsAfter) {
    return bodLbsAfter * this.state.bodTreatmentSurcharge
  }

  calcMonthlyBillAfter(dailyBillAfter) {
    return dailyBillAfter * 30
  }

  calcTotalSavings(monthlyBillBefore, monthlyBillAfter) {
    return monthlyBillBefore - monthlyBillAfter - 22549
  }

  calcTotalSavingsPercent(monthlyBillBefore, totalSavings) {
    return (totalSavings / monthlyBillBefore)
  }

  convertPercentForCalc(number) {
    return number / 100
  }

  convertPercentForDisplay(number) {
    const percent = Math.round(number * 100)
    return String(percent) + '%'
  }

  roundHundredths(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100
  }

  render() {
    const bodLbsBefore          = Math.round(this.state.bodLbsBefore)
    const bodTreatmentSurcharge = Math.round(this.state.bodTreatmentSurcharge)
    const dailyBillBefore       = this.roundHundredths(this.state.dailyBillBefore)
    const monthlyBillBefore     = this.roundHundredths(this.state.monthlyBillBefore)
    const bodConcentrationAfter = this.convertPercentForDisplay(this.state.bodConcentrationAfter)
    const bodLbsAfter           = Math.round(this.state.bodLbsAfter)
    const dailyBillAfter        = this.roundHundredths(this.state.dailyBillAfter)
    const monthlyBillAfter      = this.roundHundredths(this.state.monthlyBillAfter)
    const totalSavings          = Math.round(this.state.totalSavings)
    const totalSavingsPercent   = this.convertPercentForDisplay(this.state.totalSavingsPercent)

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group clearfix">
          <label htmlFor="waste-water-flow">Waste Water Flow - (Gallons / Day)</label>
          <input 
            className="form-control"
            id="waste-water-flow" 
            type="number" 
            value={this.state.wasteWaterFlow} 
            min="1"
            onChange={this.handleChange} 
            required />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="bod-concentration">BOD Concentration - mg/l (ppm)</label>
          <input 
            className="form-control"
            id="bod-concentration" 
            type="number" 
            value={this.state.bodConcentrationBefore} 
            min="1"
            onChange={this.handleChange} 
            required />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="bod-lbs-before">BOD in Lbs for Surcharge Calculation - Lbs / Day</label>
          <input 
            className="form-control"
            id="bod-lbs-before" 
            type="number" 
            value={bodLbsBefore} 
            readOnly 
            disabled />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="bod-treatment-surcharge">BOD Treatment Surcharge - USD / Lbs</label>
          <input 
            className="form-control"
            id="bod-treatment-surcharge" 
            type="number" 
            value={bodTreatmentSurcharge} 
            min="1"
            onChange={this.handleChange} 
            required />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="daily-bill-before">Daily Bill - USD</label>
          <input 
            className="form-control"
            id="daily-bill-before" 
            type="number" 
            value={dailyBillBefore} 
            readOnly 
            disabled />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="monthly-bill-before">Monthly Bill - USD</label>
          <input 
            className="form-control"
            id="monthly-bill-before" 
            type="number" 
            value={monthlyBillBefore} 
            readOnly 
            disabled />
        </div>

        <hr />

        <div className="form-group clearfix">
          <label htmlFor="bod-removal-efficiency">Install BioMod product with BOD remove efficiency of</label>
          <input 
            className="form-control"
            id="bod-removal-efficiency" 
            type="number" 
            value={this.state.bodRemovalEfficiency} 
            onChange={this.handleChange} 
            min="1" 
            max="99" 
            step="1" 
            required />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="reduced-bod-concentration">Reduced BOD Concentration mg/l (ppm)</label>
          <input 
            className="form-control"
            id="reduced-bod-concentration" 
            type="text" 
            value={bodConcentrationAfter} 
            readOnly 
            disabled />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="bod-lbs-after">BOD in Lbs for Surcharge Calculation Lbs/Day</label>
          <input 
            className="form-control"
            id="bod-lbs-after" 
            type="number" 
            value={bodLbsAfter} 
            readOnly 
            disabled />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="daily-bill-after"><strong>New Daily Bill - USD</strong></label>
          <input 
            className="form-control"
            id="daily-bill-after" 
            type="number" 
            value={dailyBillAfter} 
            readOnly 
            disabled />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="monthly-bill-after"><strong>New Monthly Bill - USD</strong></label>
          <input 
            className="form-control"
            id="monthly-bill-after" 
            type="number" 
            value={monthlyBillAfter} 
            readOnly 
            disabled />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="total-savings"><strong>Total Savings/Month with BioMOD DAF + MBBR</strong></label>
          <input 
            className="form-control"
            id="total-savings" 
            type="number" 
            value={totalSavings} 
            readOnly 
            disabled />
        </div>

        <div className="form-group clearfix">
          <label htmlFor="total-savings-percent"><strong>Savings Per Month</strong></label>
          <input 
            className="form-control"
            id="total-savings-percent" 
            type="text" 
            value={totalSavingsPercent} 
            readOnly 
            disabled />
        </div>
      </form>
    )
  }
}

export default BioModForm
