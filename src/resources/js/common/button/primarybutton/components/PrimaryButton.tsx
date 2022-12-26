import { Avatar, Card, CardContent, Divider, Button, Collapse, IconButton, ButtonGroup, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { green, grey, yellow } from '@mui/material/colors';
import { styled } from '@mui/material';

const PrimaryButton = styled(Button)({
    ':hover' : {
        backgroundColor: green[600]
    }
})

export default PrimaryButton;