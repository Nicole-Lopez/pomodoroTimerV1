import React from 'react'

export default function BtnChangeTime({id, label, disabled, length, setLength, type}) {
	return (
		<div className='btn_change_time'>
			<h3 id={id[0]}>{label}</h3>
			<div>
				<button className="controls decrement" id={id[1]} onClick={() => setLength(type, 'dec')} disabled={disabled === 'playing'}><i class="bi bi-dash-circle"></i></button>
				<span id={id[3]}>{length}</span>
				<button className="controls increment" id={id[2]} onClick={() => setLength(type, 'inc')} disabled={disabled === 'playing'}><i class="bi bi-plus-circle"></i></button>
			</div>
		</div>
	)
}