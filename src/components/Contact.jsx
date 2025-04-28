import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane, FaUser } from 'react-icons/fa';

const Contact = ({ listing }) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/users/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);

    return (
        <>
            {landlord && (
                <div className="space-y-4 p-6 bg-white rounded-xl shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaUser className="text-purple-600 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Contact Landlord</h3>
                            <p className="text-gray-600">
                                Contact <span className="font-semibold text-purple-600">{landlord.username}</span> about
                                <span className="font-semibold"> {listing.name.toLowerCase()}</span>
                            </p>
                        </div>
                    </div>

                    <textarea
                        name="message"
                        id="message"
                        rows="4"
                        value={message}
                        onChange={onChange}
                        placeholder="Enter your message here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                    ></textarea>

                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${encodeURIComponent(message)}`}
                        className="block w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all shadow-md hover:shadow-lg text-center uppercase flex items-center justify-center gap-2"
                    >
                        <FaPaperPlane />
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
};

export default Contact;