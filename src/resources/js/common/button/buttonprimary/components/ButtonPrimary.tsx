import { Button, styled } from '@mui/material';
import { green, grey, yellow } from '@mui/material/colors';

const ButtonPrimary = styled(Button)({
    ':hover' : {
        backgroundColor: green[600]
    }
})

export default ButtonPrimary;