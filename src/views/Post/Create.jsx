import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import PostService from "../../services/PostService";

const Create = () => {
    const { auth } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [img, setImg] = useState('');
    const [imgPreview, setImgPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const validateForm = () => {
        const newErrors = {};
        if (!title) {
            newErrors.title = "This field is required";
        } else if (title.length < 6) {
            newErrors.title = "The title must contain 6 characters";
        }

        if (!desc) {
            newErrors.desc = "This field is required";
        } else if (desc.length < 12) {
            newErrors.desc = "The title must contain 12 characters";
        }

        if (!img) {
            newErrors.img = "This field is required";
        } else if (!['image/png', 'image/jpg', 'image/jpeg'].includes(img.type)) {
            newErrors.img = "Only PNG, JPG and JPEG files are allowed";
        }

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
                setErrors(prevErrors => ({ ...prevErrors, img: 'Only PNG, JPG and JPEG files are allowed' }));
                return;
            }
            setImg(file);
            setImgPreview(URL.createObjectURL(file)); //Set image preview URL
            setErrors(prevErrors => ({ ...prevErrors, img: null }));  // Clear image error if any
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    });

    // Reset the form
    const resetForm = () => {
        setTitle('');
        setDesc('');
        setImg('');
        setErrors({});
        setImgPreview(null);
    }

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', desc);
            formData.append('file', img);
            console.log(formData);

            try {
                const response = await PostService.store(formData);
                const data = response.data;
                if (data) {
                    // Reset form
                    resetForm();

                    navigate('/post', {
                        state: {
                            message: data.message, type: 'success'
                        }
                    });
                } else {
                    showErrorToast(response.error);
                }

            } catch (error) {
                showErrorToast('An error occurred. Please try again later.');
            }
        }
    }

    return (
        <div className="container">
            <ToastContainer />
            <div className="row justify-content-center mt-5">
                <div className="col-8">
                    <div className="card">
                        <form onSubmit={handleCreatePost}>
                            <div className="card-header">Create Post</div>
                            <div className="card-body">
                                <div>
                                    <label htmlFor="title">Title<span className="text-danger">*</span></label>
                                    <input type="text" name="title" id="title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                                    {errors.title && <p className="text-danger">{errors.title}</p>}
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="desc">Description<span className="text-danger">*</span></label>
                                    <textarea name="desc" id="" cols={5} className="form-control" value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
                                    {errors.desc && <p className="text-danger">{errors.desc}</p>}
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="img">Image<span className="text-danger">*</span></label>
                                    <div className="card text-center">
                                        <div {...getRootProps({ className: 'dropzone' })} className="form-control p-3">
                                            <input {...getInputProps()} />
                                            {
                                                imgPreview ?
                                                    imgPreview && <img src={imgPreview} alt="Selected" className="img-thumbnail mt-2" style={{ maxHeight: "200px" }} /> :
                                                    <p>Click or drag and drop here</p>
                                            }
                                        </div>
                                    </div>
                                    {errors.img && <p className="text-danger">{errors.img}</p>}
                                </div>

                                <div className="mt-3 d-flex float-end mb-2">
                                    <button type="submit" className="btn btn-primary">Create</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create;