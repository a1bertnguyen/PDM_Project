// src/Page/Task/TaskCard/EditTaskForm.jsx
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Autocomplete, Grid, TextField, CircularProgress, Alert } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../../../ReduxToolkit/TaskSlice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

// Available tags for tasks
const tags = ["Angular", "React", "Vue.js", "Spring Boot", "Node.js", "Python", "Java", "JavaScript", "HTML/CSS", "MongoDB", "MySQL", "PostgreSQL"];

export default function EditTaskForm({ handleClose, open, task }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.task);

    const [formData, setFormData] = useState({
        title: "",
        image: "",
        description: "",
        tags: [],
        deadline: null,
    });

    const [selectedTags, setSelectedTags] = useState([]);

    // Initialize form with task data when the component mounts or task changes
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                image: task.image || "",
                description: task.description || "",
                deadline: task.deadline ? dayjs(task.deadline) : dayjs(),
            });
            setSelectedTags(task.tags || []);
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleTagsChange = (event, value) => {
        setSelectedTags(value);
    };

    const handleDeadlineChange = (date) => {
        setFormData({
            ...formData,
            deadline: date
        });
    };

    const formatDate = (date) => {
        if (!date) return null;

        const year = date.$y;
        const month = date.$M;
        const day = date.$D;
        const hours = date.$H;
        const minutes = date.$m;
        const seconds = date.$s;
        const milliseconds = date.$ms;

        return new Date(year, month, day, hours, minutes, seconds, milliseconds).toISOString();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.title || !formData.description || !formData.deadline) {
            return;
        }

        // Prepare update data
        const updatedTaskData = {
            ...formData,
            deadline: formatDate(formData.deadline),
            tags: selectedTags,
        };

        // Dispatch action to update task
        dispatch(updateTask({
            id: task.id,
            updatedTaskData,
        }))
            .unwrap()
            .then(() => {
                handleClose();
            });
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" className="text-center mb-4">
                        Edit Task
                    </Typography>

                    {error && (
                        <Alert severity="error" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Image URL"
                                    fullWidth
                                    name='image'
                                    value={formData.image}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Enter image URL (optional)"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    id="multiple-limit-tags"
                                    options={tags}
                                    value={selectedTags}
                                    onChange={handleTagsChange}
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) => <TextField
                                        label="Tags"
                                        fullWidth
                                        {...params}
                                    />}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        onChange={handleDeadlineChange}
                                        className="w-full"
                                        label="Deadline"
                                        value={formData.deadline}
                                        renderInput={(params) => <TextField {...params} />}
                                        disabled={loading}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    className="customeButton"
                                    type="submit"
                                    sx={{ padding: ".9rem" }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : "Update"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}