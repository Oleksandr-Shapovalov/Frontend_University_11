const Modal = ({ visible, onClose, children }) => {
  return (
    <div className={["modalContainer", visible ? "active" : ""].join(" ")} onClick={onClose}>
      <div className={["modalContent", visible ? "active" : ""].join(" ")} onClick={(e) => e.stopPropagation()}>
        <div className="text-xl text-center text-indigo-400">{children}</div>
        <div
          onClick={onClose}
          className="mt-5 px-5 py-1 text-xl text-center text-indigo-300
            duration-300  cursor-pointer">
          Ok
        </div>
      </div>
    </div>
  );
};

export default Modal;
