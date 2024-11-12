const GenderCheckbox = ({onCheckboxChange, selectedGender}) => {
  return (
    <div className='flex'>
      <div className='form-control'>
        <label className={'label gap-2 cursor-pointer ${selectedGender === "male" ? "selected" : ""}'}>
            <span className='label-text'>Male</span>
        </label>
        <input type="checkbox" className='checkbox border-slate-100'
        checked = {selectedGender === "male"}
        onChange={() => onCheckboxChange("male")}/>
      </div>

      <div className='form-control'>
        <label className={'label gap-2 cursor-pointer ${selectedGender === "female" ? "selected" : ""}'}>
            <span className='label-text'>Female</span>
        </label>
        <input type="checkbox" className='checkbox border-slate-100'
        checked = {selectedGender === 'female'}
        onChange={() => onCheckboxChange('female')}/>
      </div>
    </div>
  )
}

export default GenderCheckbox
