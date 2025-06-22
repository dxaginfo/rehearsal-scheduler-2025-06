import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Divider,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useCreateRehearsalMutation, useUpdateRehearsalMutation, useGetRehearsalQuery } from '../../services/rehearsalsApi';
import { useGetBandsQuery } from '../../services/bandsApi';
import { useGetSongsByBandQuery } from '../../services/songsApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import RecurringPatternSelector from './RecurringPatternSelector';

const RehearsalForm = () => {
  const { rehearsalId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [selectedBandId, setSelectedBandId] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  
  // Queries and mutations
  const { data: bands, isLoading: isLoadingBands, error: bandsError } = useGetBandsQuery();
  const { data: songsData, isLoading: isLoadingSongs } = useGetSongsByBandQuery(selectedBandId, { skip: !selectedBandId });
  const { data: rehearsal, isLoading: isLoadingRehearsal } = useGetRehearsalQuery(rehearsalId, { skip: !rehearsalId });
  
  const [createRehearsal, { isLoading: isCreating }] = useCreateRehearsalMutation();
  const [updateRehearsal, { isLoading: isUpdating }] = useUpdateRehearsalMutation();
  
  const isSubmitting = isCreating || isUpdating;
  const isEdit = Boolean(rehearsalId);
  
  // Setup form validation schema
  const validationSchema = Yup.object({
    bandId: Yup.string().required('Band is required'),
    title: Yup.string().required('Title is required').max(100, 'Title must be less than 100 characters'),
    location: Yup.string().required('Location is required'),
    startDatetime: Yup.date().required('Start date and time is required'),
    endDatetime: Yup.date()
      .required('End date and time is required')
      .min(Yup.ref('startDatetime'), 'End time must be after start time'),
    description: Yup.string().max(500, 'Description must be less than 500 characters'),
  });
  
  // Initialize formik
  const formik = useFormik({
    initialValues: {
      bandId: '',
      title: '',
      location: '',
      startDatetime: new Date(),
      endDatetime: new Date(new Date().setHours(new Date().getHours() + 2)),
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const rehearsalData = {
          ...values,
          recurringPattern: isRecurring ? recurringPattern : null,
          songs: selectedSongs.map((song, index) => ({
            songId: song.id,
            orderIndex: index,
          })),
        };
        
        if (isEdit) {
          await updateRehearsal({ id: rehearsalId, ...rehearsalData }).unwrap();
          toast.success('Rehearsal updated successfully');
        } else {
          await createRehearsal(rehearsalData).unwrap();
          toast.success('Rehearsal created successfully');
        }
        
        navigate('/rehearsals');
      } catch (error) {
        console.error('Error saving rehearsal:', error);
        toast.error(error.data?.message || 'Failed to save rehearsal');
      }
    },
  });
  
  // Load rehearsal data when editing
  useEffect(() => {
    if (rehearsal && isEdit) {
      setSelectedBandId(rehearsal.bandId);
      setIsRecurring(Boolean(rehearsal.recurringPattern));
      setRecurringPattern(rehearsal.recurringPattern);
      
      if (rehearsal.songs) {
        const sortedSongs = [...rehearsal.songs]
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map(item => item.song);
        setSelectedSongs(sortedSongs);
      }
      
      formik.setValues({
        bandId: rehearsal.bandId,
        title: rehearsal.title,
        location: rehearsal.location,
        startDatetime: new Date(rehearsal.startDatetime),
        endDatetime: new Date(rehearsal.endDatetime),
        description: rehearsal.description || '',
      });
    }
  }, [rehearsal, isEdit]);
  
  // Update selected band ID when form value changes
  useEffect(() => {
    if (formik.values.bandId && formik.values.bandId !== selectedBandId) {
      setSelectedBandId(formik.values.bandId);
      setSelectedSongs([]); // Reset selected songs when band changes
    }
  }, [formik.values.bandId]);
  
  if (isLoadingRehearsal && isEdit) {
    return <LoadingSpinner />;
  }
  
  if (bandsError) {
    return <ErrorAlert message="Failed to load bands. Please try again later." />;
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {isEdit ? 'Edit Rehearsal' : 'Schedule New Rehearsal'}
          </Typography>
          
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={formik.touched.bandId && Boolean(formik.errors.bandId)}>
                  <InputLabel id="band-select-label">Band</InputLabel>
                  <Select
                    labelId="band-select-label"
                    id="bandId"
                    name="bandId"
                    value={formik.values.bandId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Band"
                    disabled={isEdit || isLoadingBands}
                  >
                    {isLoadingBands ? (
                      <MenuItem disabled>Loading bands...</MenuItem>
                    ) : (
                      bands?.map((band) => (
                        <MenuItem key={band.id} value={band.id}>
                          {band.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {formik.touched.bandId && formik.errors.bandId && (
                    <FormHelperText>{formik.errors.bandId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Rehearsal Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="location"
                  name="location"
                  label="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Start Date & Time"
                  value={formik.values.startDatetime}
                  onChange={(value) => formik.setFieldValue('startDatetime', value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.startDatetime && Boolean(formik.errors.startDatetime),
                      helperText: formik.touched.startDatetime && formik.errors.startDatetime,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="End Date & Time"
                  value={formik.values.endDatetime}
                  onChange={(value) => formik.setFieldValue('endDatetime', value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.endDatetime && Boolean(formik.errors.endDatetime),
                      helperText: formik.touched.endDatetime && formik.errors.endDatetime,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description (optional)"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      name="isRecurring"
                      color="primary"
                    />
                  }
                  label="This is a recurring rehearsal"
                />
              </Grid>
              
              {isRecurring && (
                <Grid item xs={12}>
                  <RecurringPatternSelector
                    value={recurringPattern}
                    onChange={setRecurringPattern}
                    startDate={formik.values.startDatetime}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Rehearsal Setlist
                </Typography>
                
                {selectedBandId ? (
                  <Autocomplete
                    multiple
                    id="songs-select"
                    options={songsData?.songs || []}
                    getOptionLabel={(option) => `${option.title} - ${option.artist || 'Unknown'}`}
                    value={selectedSongs}
                    onChange={(_, newValue) => setSelectedSongs(newValue)}
                    loading={isLoadingSongs}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Songs (optional)"
                        placeholder="Add songs to rehearsal"
                        error={false}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={`${option.title} - ${option.artist || 'Unknown'}`}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                ) : (
                  <Typography color="textSecondary" variant="body2">
                    Select a band to add songs to the rehearsal
                  </Typography>
                )}
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/rehearsals')}
                sx={{ mr: 2 }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || !formik.isValid}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isEdit ? (
                  'Update Rehearsal'
                ) : (
                  'Create Rehearsal'
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default RehearsalForm;