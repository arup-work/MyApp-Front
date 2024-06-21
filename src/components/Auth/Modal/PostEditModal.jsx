import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

const PostEditModal = ({ show, handleClose, postDetails }) => {
    const [postId, setPostId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imgPreview, setImgPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (!['image/png','image/jpg','image/jpeg'].includes(file.type)) {
                setErrors(prevErrors => ({ ...prevErrors, image: 'Only PNG,  and JPEG files are allowed' }));
                return;
            }
            setImage(file);
            setImgPreview(URL.createObjectURL(file)); //Set image preview URL
            setErrors(prevErrors => ({ ...prevErrors, image: null }));  // Clear image error if any
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    });

    const validateForm = () => {
        const newErrors = {};
        if (!title) {
            newErrors.title = "This field is required";
        } else if (title.length < 6) {
            newErrors.title = "The title must contain 6 characters";
        }

        if (!description) {
            newErrors.description = "This field is required";
        } else if (description.length < 12) {
            newErrors.description = "The title must contain 12 characters";
        }

        if(image && !['image/png','image/jpg','image/jpeg'].includes(image.type)) {
            newErrors.image = "Only PNG, JPG and JPEG files are allowed";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleUpdatePost = async(e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData();
            formData.append('title',title);
            formData.append('description',description);
            formData.append('file',image);

            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/post/${postId}`,{
                    method: 'PUT',
                    body: formData
                });

                const data = await response.json();
                if (response.ok) {
                    console.log("hii")
                    navigate('/post', {
                        state : {
                            message :  data.message, type : 'success' 
                        }
                    });
                    handleClose();
                }else{
                    
                }

            } catch (error) {
                setErrors('An error occurred. Please try again later.');
            }
        }
    }

    useEffect(() => {
        if (postDetails) {
            setTitle(postDetails.title);
            setDescription(postDetails.description);
            // setImage(postDetails.image);
            setImgPreview(postDetails.image)
            setPostId(postDetails._id)
        }
    }, [postDetails])
    return (
        <div>
            <div className={`modal fade ${show ? 'show' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div>
                                    <label htmlFor="title">Title</label>
                                    <input type="text" value={title} onChange={(e) => e.target.value} className="form-control" />
                                    {errors.title && <p className="text-danger">{errors.title}</p>}
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="description">Description</label>
                                    <textarea name="description" id="description" onChange={(e) => e.target.value} className="form-control"  value={description}/>
                                    {errors.desc && <p className="text-danger">{errors.desc}</p>}

                                </div>
                                <div className="mt-2">
                                    <label htmlFor="image" className="form-label">Image</label>
                                    <div className="card text-center">
                                        <div {...getRootProps({ className: 'dropzone' })} className="form-control p-3">
                                            <input {...getInputProps()} />
                                            {
                                                imgPreview ?
                                                imgPreview && <img src={imgPreview} alt="Selected" className="img-thumbnail mt-2" style={{maxHeight: "200px"}} /> :
                                                    <p>Click or drag and drop here</p>
                                            }
                                        </div>
                                    </div>
                                    {errors.image && <p className="text-danger">{errors.image}</p>}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdatePost}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </div>
    )
}

export default PostEditModal;