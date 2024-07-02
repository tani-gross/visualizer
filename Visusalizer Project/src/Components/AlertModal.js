const AlertModal = ({ isOpen, onClose, message}) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
            <label>
                <br />
                <h2 style={{color:"red"}}>Alert!</h2>
                {message}
            </label>
            </div>
        </div>
    );
};

export default AlertModal;
