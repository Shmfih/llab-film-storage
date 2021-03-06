import React, { PureComponent } from 'react';
import './PhotoPrint.css';
import { printPrice } from '../printPrice';
import NewPrintingRequest from '../components/PhotoPrint/NewPrintingRequest';
import PrintIntro from '../components/PhotoPrint/PrintIntro';
// import { ReCaptcha } from 'react-recaptcha-google'
import { db } from '../firebase';
import { formatCurrency } from '../functions';
import PrintItem from '../components/PhotoPrint/PrintItem';

export default class PhotoPrinting extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			printList: [],
			isShip: false,
			shippingInfo: '',
			orderNote: '',
			phoneNumber: '',
			isPurchased: false,
		};
	}

	addNewPrintItem = printItem => {
		const newPrintList = [
			...this.state.printList
		];
		// console.log(printItem);
		const findIdx = newPrintList.findIndex(
			item => item.printType === printItem.printType && item.printSize === printItem.printSize
		);
		if (findIdx >= 0) {
			newPrintList[findIdx].printQuantity += printItem.printQuantity;
		} else {
			newPrintList.push(printItem);
		}
		this.setState({ printList: newPrintList });
		// console.log(newPrintList);
	};

	removePrintItem = printItem => {
		const confirmRemove = window.confirm('Bạn có muốn xóa yêu cầu này?');
		if (!confirmRemove) return;
		const newPrintList = [
			...this.state.printList
		];
		// console.log(printItem);
		const findIdx = newPrintList.findIndex(
			item => item.printType === printItem.printType && item.printSize === printItem.printSize
		);

		if (findIdx >= 0) {
			newPrintList.splice(findIdx, 1);
		}
		this.setState({ printList: newPrintList });
		// console.log(newPrintList);
	};

	generateNewID = () => {
		const today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		const yyyy = today.getFullYear();
		const randonNumber= Math.floor(Math.random()*999);
		return `p${yyyy}${mm}${dd}${randonNumber}`;
		
	}

	submitPrintingItem = () => {
		// console.log(printItem);
		try {
			const submitInfomation = { ...this.state, submitDate: Date.now() };
			// console.log(submitInfomation);
			const requestId = this.generateNewID();
			db.collection('PrintingRequest').doc(requestId).set(submitInfomation).then(ref => {
				alert('Đơn hàng đã được ghi nhận!');
				// Clear old info
				this.setState({
					printList: [],
					isShip: false,
					shippingInfo: '',
					orderNote: '',
					phoneNumber: ''
				});
			});
		} catch (error) {
			alert('Adding error!');
			console.log(error);
		}
	};
	render() {
		const printingArray = Object.keys(printPrice);
		const { printList, isShip, shippingInfo, orderNote } = this.state;
		if (printList.length == 0)
			return (
				<div className="container content-wrapper">
					<PrintIntro />
					<table className="table print-table">
						<thead>
							<tr>
								<th scope="col">Kiểu in</th>
								<th scope="col">Kích cỡ</th>
								<th scope="col">Số lượng</th>
								<th scope="col">Đơn giá</th>
								<th scope="col">Tổng</th>
								<th scope="col">#</th>
							</tr>
						</thead>
						<tbody>
							<NewPrintingRequest printPrice={printPrice} addNewPrintItem={this.addNewPrintItem} />
						</tbody>
					</table>
				</div>
			);
		if (printList.length > 0)
			return (
				<div className="container content-wrapper">
					<PrintIntro />
					<table className="table print-table">
						<thead>
							<tr>
								<th scope="col">Kiểu in</th>
								<th scope="col">Kích cỡ</th>
								<th scope="col">Số lượng</th>
								<th scope="col">Đơn giá</th>
								<th scope="col">Tổng</th>
								<th scope="col">#</th>
							</tr>
						</thead>
						<tbody>
							{/* Requests list */}
							{printList.map(item => (
								<PrintItem
									key={`${item.printType}_${item.printSize}`}
									itemDetail={item}
									removePrintitemDetail={this.removePrintitemDetail}
								/>
							))}
							{/* Add new request */}
							<NewPrintingRequest printPrice={printPrice} addNewPrintItem={this.addNewPrintItem} />

							<tr>
								<td colSpan="3" />
								<td>
									<strong>Total: </strong>
								</td>
								<td>
									{formatCurrency(printList.reduce(
										(prev, curr) => prev + curr.printQuantity * curr.printItemPrice,
										0
									))}
								</td>
							</tr>

							<tr>
								<td colSpan="3">
									<div className="form-group shipping-info">
										<input
											type="checkbox"
											className="form-check-input shipping-checkbox"
											id="isShip"
											value={this.state.isShip}
											onClick={e => this.setState({ isShip: !isShip })}
										/>
										<label className="form-check-label" htmlFor="isShip">
											Ship/Chuyển phát nhanh
										</label>
										<input
											type="text"
											className="form-control"
											id="ship-infomation"
											onChange={e => this.setState({ shippingInfo: e.target.value })}
										/>
										<label className="form-check-label" htmlFor="phoneNumber">
											Số điện thoại:
										</label>
										<input
											type="text"
											className="form-control"
											name="phoneNumber"
											onChange={e => this.setState({ phoneNumber: e.target.value })}
										/>
									</div>
								</td>
								<td colSpan="3">
									<div className="form-group">
										<label className="form-check-label" htmlFor="note">
											Ghi chú:
										</label>
										<textarea
											className="form-control"
											id="note"
											rows="3"
											onChange={e => this.setState({ orderNote: e.target.value })}
										/>
									</div>
								</td>
							</tr>

							<tr>
								<td colSpan="6">
									<div className="form-group submit-button">
										<button className="btn btn-success" onClick={() => this.submitPrintingItem()}>
											Đồng ý
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			);
	}
}
