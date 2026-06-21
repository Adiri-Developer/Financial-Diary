import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PasswordInput = ({ id, value, onChange, className }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative w-full">
            <input
                id={id}
                type={show ? "text" : "password"}
                className={`${className} pr-10`}
                value={value}
                onChange={onChange}
            />
            {value && (
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                    {show ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
};

const OtpInput = ({ length = 6, onOtpChange }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        onOtpChange(newOtp.join(""));

        // Focus next input
        if (element.value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').slice(0, length).replace(/[^0-9]/g, '');
        if (pasteData) {
            const newOtp = [...otp];
            for (let i = 0; i < pasteData.length; i++) {
                newOtp[i] = pasteData[i];
            }
            setOtp(newOtp);
            onOtpChange(newOtp.join(""));
            if (pasteData.length < length) {
                inputRefs.current[pasteData.length].focus();
            } else {
                inputRefs.current[length - 1].focus();
            }
        }
    };

    return (
        <div className="flex gap-2 justify-center mt-6">
            {otp.map((data, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 text-center text-xl font-bold border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    ref={(ref) => inputRefs.current[index] = ref}
                />
            ))}
        </div>
    );
};

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    
    // Profile Information Form
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        address: user.address || '',
        province_id: user.province_id || '',
        province_name: user.province_name || '',
        city_id: user.city_id || '',
        city_name: user.city_name || '',
        district_id: user.district_id || '',
        district_name: user.district_name || '',
    });

    const [emailInput, setEmailInput] = useState(user.email);
    const [phoneInput, setPhoneInput] = useState(user.phone_number || '');
    const [sendingOtp, setSendingOtp] = useState(false);

    // Password Update Form
    const { 
        data: pwdData, 
        setData: setPwdData, 
        put: putPwd, 
        errors: pwdErrors, 
        processing: pwdProcessing, 
        recentlySuccessful: pwdRecentlySuccessful,
        reset: resetPwd 
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Region Data States
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);

    // OTP Modal States
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpProcessing, setOtpProcessing] = useState(false);

    // Fetch Provinces
    useEffect(() => {
        fetch('/api/regions/provinces')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error(err));
    }, []);

    // Fetch Cities when Province changes
    useEffect(() => {
        if (data.province_id) {
            fetch(`/api/regions/regencies/${data.province_id}`)
                .then(res => res.json())
                .then(data => setCities(data))
                .catch(err => console.error(err));
        } else {
            setCities([]);
            setDistricts([]);
        }
    }, [data.province_id]);

    // Fetch Districts when City changes
    useEffect(() => {
        if (data.city_id) {
            fetch(`/api/regions/districts/${data.city_id}`)
                .then(res => res.json())
                .then(data => setDistricts(data))
                .catch(err => console.error(err));
        } else {
            setDistricts([]);
        }
    }, [data.city_id]);

    const submitProfile = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        putPwd(route('password.update'), {
            preserveScroll: true,
            errorBag: 'updatePassword',
            onSuccess: () => {
                resetPwd();
                Swal.fire({
                    title: 'Success!',
                    text: 'Password has been successfully updated!',
                    icon: 'success',
                    confirmButtonColor: '#4f46e5'
                });
            },
        });
    };

    const handleSendOtp = async (type) => {
        setSendingOtp(true);
        try {
            const identifier = type === 'email' ? emailInput : phoneInput;
            const res = await axios.post(route('profile.send-otp'), { type, identifier });
            Swal.fire({
                title: 'OTP Sent',
                text: res.data.message,
                icon: 'success',
                confirmButtonColor: '#4f46e5'
            });
            setShowOtpModal(true);
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Failed to send OTP.',
                icon: 'error',
                confirmButtonColor: '#4f46e5'
            });
        } finally {
            setSendingOtp(false);
        }
    };

    const submitOtp = async (e) => {
        e.preventDefault();
        setOtpProcessing(true);
        setOtpError('');
        try {
            await axios.post(route('profile.verify-otp'), { otp_code: otpCode });
            setShowOtpModal(false);
            Swal.fire({
                title: 'Verified!',
                text: 'Your contact information has been updated.',
                icon: 'success',
                confirmButtonColor: '#4f46e5'
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setOtpError(error.response.data.errors.otp_code[0] || 'Invalid OTP');
            } else {
                setOtpError(error.response?.data?.message || 'Invalid OTP or expired.');
            }
        } finally {
            setOtpProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Profile</h2>}>
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Security & Contacts (Email & Phone) */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <section className="max-w-xl space-y-6">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Contact Information</h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Update your email and phone number using OTP verification.</p>
                            </header>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <div className="flex items-center gap-3 mt-1">
                                    <input
                                        id="email"
                                        type="email"
                                        className="block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                    />
                                    {emailInput !== user.email && (
                                        <button 
                                            onClick={() => handleSendOtp('email')}
                                            disabled={sendingOtp}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                <div className="flex items-center gap-3 mt-1">
                                    <input
                                        id="phone_number"
                                        type="text"
                                        className="block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                    />
                                    {phoneInput !== (user.phone_number || '') && (
                                        <button 
                                            onClick={() => handleSendOtp('phone')}
                                            disabled={sendingOtp}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Profile Information */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Personal Information</h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Update your account's name and address.</p>
                            </header>

                            <form onSubmit={submitProfile} className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                    <input
                                        id="name"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <div className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</div>}
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                    <textarea
                                        id="address"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Province</label>
                                    <select
                                        id="province"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={data.province_id}
                                        onChange={(e) => {
                                            const selectedOptions = e.target.options;
                                            const name = selectedOptions[selectedOptions.selectedIndex].text;
                                            setData(data => ({
                                                ...data,
                                                province_id: e.target.value,
                                                province_name: name,
                                                city_id: '',
                                                city_name: '',
                                                district_id: '',
                                                district_name: ''
                                            }));
                                        }}
                                    >
                                        <option value="">Select Province</option>
                                        {provinces.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">City / Regency</label>
                                    <select
                                        id="city"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={data.city_id}
                                        onChange={(e) => {
                                            const selectedOptions = e.target.options;
                                            const name = selectedOptions[selectedOptions.selectedIndex].text;
                                            setData(data => ({
                                                ...data,
                                                city_id: e.target.value,
                                                city_name: name,
                                                district_id: '',
                                                district_name: ''
                                            }));
                                        }}
                                        disabled={!data.province_id}
                                    >
                                        <option value="">Select City/Regency</option>
                                        {cities.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300">District</label>
                                    <select
                                        id="district"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={data.district_id}
                                        onChange={(e) => {
                                            const selectedOptions = e.target.options;
                                            const name = selectedOptions[selectedOptions.selectedIndex].text;
                                            setData(data => ({
                                                ...data,
                                                district_id: e.target.value,
                                                district_name: name
                                            }));
                                        }}
                                        disabled={!data.city_id}
                                    >
                                        <option value="">Select District</option>
                                        {districts.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                        Save Profile
                                    </button>
                                    {recentlySuccessful && <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>}
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Update Password */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Update Password</h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Ensure your account is using a long, random password to stay secure.</p>
                            </header>

                            <form onSubmit={submitPassword} className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                                    <PasswordInput
                                        id="current_password"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={pwdData.current_password}
                                        onChange={(e) => setPwdData('current_password', e.target.value)}
                                    />
                                    {pwdErrors.current_password && <div className="mt-2 text-sm text-red-600 dark:text-red-400">{pwdErrors.current_password}</div>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                    <PasswordInput
                                        id="password"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={pwdData.password}
                                        onChange={(e) => setPwdData('password', e.target.value)}
                                    />
                                    {pwdErrors.password && <div className="mt-2 text-sm text-red-600 dark:text-red-400">{pwdErrors.password}</div>}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-black"
                                        value={pwdData.password_confirmation}
                                        onChange={(e) => setPwdData('password_confirmation', e.target.value)}
                                    />
                                    {pwdErrors.password_confirmation && <div className="mt-2 text-sm text-red-600 dark:text-red-400">{pwdErrors.password_confirmation}</div>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button disabled={pwdProcessing} className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                        Save Password
                                    </button>
                                    {pwdRecentlySuccessful && <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>}
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                                            Verify OTP
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                We have sent an OTP to your new email/phone. Please enter it below to verify the change.
                                                (Check your mail client or application logs).
                                            </p>
                                            <OtpInput onOtpChange={(val) => setOtpCode(val)} />
                                            {otpError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{otpError}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button 
                                    type="button" 
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={submitOtp}
                                    disabled={otpProcessing}
                                >
                                    Verify
                                </button>
                                <button 
                                    type="button" 
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowOtpModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
