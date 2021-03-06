import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../../functions';
import './FilmItem.css';


class FilmItem extends PureComponent {

	render() {
		const { filmData } = this.props;
		const filmDetail = filmData.data;
		const filmStatus = filmDetail.filmStatus === 'in' ? true : false;
		const statusClass = filmStatus ? '' : 'table-secondary';
		// console.log(this.props);
		return (
			<tr className={statusClass}>
				<td scope="row">
					<img className="film-image" src={filmDetail.filmImageUrl} />
				</td>
				<td>
					<span>{filmDetail.filmName}</span>
				</td>
				<td>
					<span>{filmDetail.filmType}</span>
				</td>
				<td>
					<span>{filmDetail.filmDate}</span>
				</td>
				<td>
					<span>{formatCurrency(filmDetail.filmPrice)}</span>
				</td>
				<td>
					<span
					>
						{filmDetail.filmStatus === 'in' ? 'In stock' : 'Out stock'}
					</span>
				</td>
				<td>

				</td>
			</tr>

		);

	}
}

FilmItem.propTypes = {};

export default FilmItem;
