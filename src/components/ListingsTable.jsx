export default function ListingTable({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      price: '',
      images: []
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await fetch('/api/admin/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      onClose();
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="modal-content">
          <h3 className="modal-title">Create New Listing</h3>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <button type="submit" className="submit-button">
              Create Listing
            </button>
          </form>
        </div>
      </Modal>
    );
  }