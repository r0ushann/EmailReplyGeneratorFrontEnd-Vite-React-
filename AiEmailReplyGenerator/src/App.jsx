import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { AppBar, Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Toolbar, Typography } from '@mui/material';

function App() {
 
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generateReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false); // New state for copied status

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
       emailContent,
       tone 
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReply);
    setCopied(true); // Set copied status to true
    setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">AI✨ Email Reply Generator</Typography>
        </Toolbar>
      </AppBar>
    
      <Container 
      maxWidth="md" 
      sx={{ 
        py: 4, 
        mt:4,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderRadius: 3, 
        boxShadow: 3, 
        padding: 3 
      }}
    >
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', height: '30vh', gap: 2}}>
          <FormControl sx={{ m: 1, width: '25ch' }}>
            <InputLabel id="demo-simple-select-label">Select Tone</InputLabel>
            <Select
                value={tone || ''}
                label={"Select Tone (Optional)"}
                onChange={(e) => setTone(e.target.value)}>
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
          </FormControl>
          <TextField 
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            label="Add Original Email Content"
            value={emailContent || ''}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb:6}}/>
        </Box>
        <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth
            sx={{ mt: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>
            {loading ? <CircularProgress size={34}/> : "Generate Reply🚀"}
        </Button>

        {error && (
          <Typography color='error' sx = {{mb:2}}>
            {error}
          </Typography>
        )}

{generateReply && (
  <Box sx={{ mt: 3 }}>
    <Typography 
  variant='h6' 
  gutterBottom 
  sx={{ 
    fontWeight: 'bold', 
    color: 'black',  /* Uses MUI primary theme color */
    backgroundColor: 'background.paper', /* Matches theme background */
    borderBottom: '3px solid', 
    borderColor: 'primary.main', 
    display: 'inline-block', 
    padding: '8px 16px', 
    borderRadius: 1 
  }}
>
  ✨ Generated Reply:
</Typography>
    <Box sx={{ 
      backgroundColor: '#f5f5f5', 
      borderLeft: '4px solidrgb(92, 5, 41)', 
      p: 2, 
      borderRadius: 1 
    }}>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
        {generateReply}
      </Typography>
    </Box>

    {/* Show Copy Button Only if Reply is Generated */}
    <Button
      variant='outlined'
      sx={{ mt: 2 }}
      onClick={handleCopy}
      disabled={!generateReply}>
        {copied ? "Copied!" : "Copy to Clipboard"}
    </Button>
  </Box>
)}
      </Container>
    </>
  )
}

export default App;