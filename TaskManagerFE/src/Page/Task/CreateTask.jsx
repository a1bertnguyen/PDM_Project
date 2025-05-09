import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { createNewTask } from '../../ReduxToolkit/TaskSlice'; // Đảm bảo rằng action name là chính xác

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  outline: "none",
  boxShadow: 24,
  p: 4,
};

const tags = ["Angular", "React", "Vuejs", "Spring boot", "Node js", "Python"];

export default function CreateNewTaskForm({ handleClose, open }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    tags: [],
    deadline: dayjs(), // dùng dayjs thay cho Date để tương thích
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (event, value) => {
    setSelectedTags(value);
  };

  const handleDeadlineChange = (date) => {
    setFormData(prev => ({ ...prev, deadline: date }));
  };

  const formatDate = (input) => {
    const {
      $y: year,
      $M: month,
      $D: day,
      $H: hours,
      $m: minutes,
      $s: seconds,
      $ms: milliseconds,
    } = input;

    return new Date(year, month, day, hours, minutes, seconds, milliseconds).toISOString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      deadline: formatDate(formData.deadline),
      tags: selectedTags,
    };
    dispatch(createNewTask(finalData)); // Đảm bảo dùng đúng tên action từ import
    console.log("Submitted data:", finalData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image"
                fullWidth
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={tags}
                value={selectedTags}
                onChange={handleTagsChange}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Tags" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={handleDeadlineChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                className="customeButton"
                type="submit"
                sx={{ padding: ".9rem" }}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}