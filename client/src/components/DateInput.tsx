import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({ selectedDate, onChange, placeholder }) => {
  return (
    <div className="relative">
      {/* Calendar Icon */}
      <span
        className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={() => document.getElementById("datepicker-input")?.focus()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 000 2h1v1a1 1 0 102 0V4h2v1a1 1 0 102 0V4h1a1 1 0 100-2h-1V1a1 1 0 10-2 0v1H9V1a1 1 0 10-2 0v1H6zM4 6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2H4zm2 2a1 1 0 112 0v2a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v2a1 1 0 11-2 0V8z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      <DatePicker
        id="datepicker-input"
        selected={selectedDate}
        onChange={onChange}
        placeholderText={placeholder || "Select date"}
        dateFormat="dd MMMM yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg mb-2 focus:border-blue-600 focus:border-[1.5px] outline-none"
      />
    </div>
  );
};

export default DateInput;
