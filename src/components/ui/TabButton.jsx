// Tab Button
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-[14px] rounded-[100px] w-full font-Raleway font-semibold text-sm leading-[150%] transition-all duration-300 whitespace-nowrap ${
      isActive ? "bg-primary-10 text-opacityClr-10" : "text-opacityClr-50 bg-transparent cursor-pointer"
    }`}
  >
    {label}
  </button>
);

export default TabButton;
