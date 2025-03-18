'use client';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import TextInput from '@/components/common/TextInput';
import { AuthFooter, AuthHeader } from '@/components/common/AppLayout';
import { IMG } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import OtpModal from '@/components/modal/otpModal';
import AppButton from '@/components/common/AppButton/AppButton';
import { COLORS } from '@/theme/colors';
import { AppLoading, CommonDialog } from '@/components';
// @ts-ignore
import { Invoker } from '../../../v2/common/modules/modServiceInvoker';
import { updateProfile } from '@/store/slices/CustomerAuthSlice.js';
import { useAppDispatch } from '@/hooks/redux.js';
import API from '@/utils/apiEnpoints';

//@ts-ignore
import modNetwork from '@/v2/common/modules/modNetwork';
import { MOD_CONSTANTS } from '@/utils/apiConstants';

const SignupScreen = () => {
  const { t } = useTranslation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { invokeOperation } = Invoker();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [maskedPhoneNumber, setMaskedPhoneNumber] = useState('');
  const [lapsRefNumber, setlapsRefNumber] = useState('');
  const dispatch = useAppDispatch();

  const [otpSentStatus, setOtpSentStatus] = useState('M'); // Default to mobile OTP
  const [isEmailVerification, setIsEmailVerification] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/public/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const initialValues = { name: '', phoneNumber: '', email: '', emiratesId: '' };

  const handleSubmit = async (values: any) => {
    // "name": "',
    // "emiratesld": 784199483035855,
    // "mobileNumber": 971542141089,
    // "emailld": "GR1@ADCB.COM",
    // "journeyType": "''

    //RESPONSE
    // "emailMasked".""
    // "lapsRefNumber"."'
    // "otpSentStatus":"'
    // "mobileMasked":'
    setAuthModalOpen(false);

    // signupUser(
    //   {
    //     name: values.name,
    //     emiratesId: values.emiratesId,
    //     mobileNumber: values.phoneNumber,
    //     emailId: values.email,
    //     journeyType: 'CUSTOMER',
    //   },
    //   (res) => {
    //     setAuthModalOpen(true)
    //     setMaskedPhoneNumber(res.mobileMasked)
    //   },
    //   (error) => {
    //     console.error("Signup failed:", error)
    //   },
    // )

    modNetwork(
      API.SIGNUP_API,
      {
        name: values.name,
        emiratesId: values.emiratesId,
        mobileNumber: values.phoneNumber,
        emailId: values.email,
        journeyType: 'CUSTOMER',
      },
      (res: any) => {
        console.log('SIGN_UP_RES', res);

        if (res.oprstatus == 0 && res.returnCode == 0) {
          setAuthModalOpen(true);
          setMaskedPhoneNumber(res.mobileMasked);
          setMaskedEmail(res.emailMasked || '');
          setOtpSentStatus(res.otpSentStatus || 'M');
          setlapsRefNumber(res.lapsRefNumber || '');
        } else {
          try {
            if (typeof res.errmsg === 'string') {
              const errorObj = JSON.parse(res.errmsg);
              alert(errorObj.errMsg_EN || 'An error occurred');
            } else if (Array.isArray(res.errmsg) && res.errmsg.length > 0) {
              alert(res.errmsg[0] || 'An error occurred');
            } else {
              alert('An error occurred. Please try again.');
            }
          } catch (error) {
            alert(res.errmsg || 'An error occurred');
          }
        }
        console.log('ERROR', res);
        //alert(JSON.stringify(res));
        // setAuthModalOpen(true);
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );
  };

  // Update the handleOTPSubmit function to handle both mobile and email verification
  const handleOTPSubmit = async (enteredOtp: string) => {
    // {
    //
    //   "lapsRefNumber" "",
    //   "applicationRefNumber".'
    //   "addinfoReqFlag" '
    //   "customerType".
    //   "lastLoginDatetime":"''
    //   }

    modNetwork(
      API.OTP_VERIFY_API,
      {
        lapsRefNumber: lapsRefNumber,
        otpType: isEmailVerification ? 'E' : 'M',
        // custOtp: enteredOtp,
        custOtp: 'DNTxg2e2UOw=',
      },
      (res: any) => {
        console.log('OTP_VERIFY_API', res);

        // B == call API twice, one for mobile, another for email
        // M == Only one modal , mobile

        // if (res.oprstatus == 0 && res.returnCode == 0) {
        //   if (otpSentStatus === 'B' && !isEmailVerification) {
        //     setIsEmailVerification(true);
        //     return;
        //   }
        //   // {
        //   //   applicationRefNumber: 'LP-ML-00014325',
        //   //   displayMessage: '',
        //   //   addinfoReqFlag: 'y',
        //   //   lapsRefNumber: 17843,
        //   //   customerName: '',
        //   //   loanApplicationNo: '',
        //   //   loanApplicationStatus: 'Blank', //Blank , PR ,PP,PC,UP,NO,CP,DU,OI,VC,PC
        //   //   rmCode: '',
        //   //   rmEmailId: 'null',
        //   //   rmMobile: 'null',
        //   //   orderId: '',
        //   //   orderStatus: '',
        //   //   rmName: 'null',
        //   //   approvalDate: '',
        //   //   customerType: 'NTB',
        //   //   lastLoginDatetime: '2025-03-03 11:38:50',
        //   // }
        //   dispatch(updateProfile(res));
        //   navigate('/Dashboard', {
        //     state: { preventBack: true },
        //   });
        // } else {
        //   navigate('/Dashboard');
        //   alert(res.errmsg);
        // }
      },
      '',
      '',
      '',
      MOD_CONSTANTS.REGISTER
    );

    // modNetwork(
    //   API.OTP_VERIFY_API,
    //   {
    //     lapsRefNumber: lapsRefNumber,
    //     otpType: isEmailVerification ? 'E' : 'M',
    //     // custOtp: enteredOtp,
    //     custOtp: 'DNTxg2e2UOw=',
    //   },
    //   (res: any) => {

    //   },
    //   '',
    //   '',
    //   '',
    //   MOD_CONSTANTS.REGISTER
    // );
  };

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        maxWidth: '1600px',
        width: '100%',
        margin: 'auto',
        paddingX: { xs: '1rem', md: '1.125rem', lg: '2rem' },
      }}
    >
      <AuthHeader />
      {isLoading && <AppLoading />}

      <CommonDialog
        open={showAlert}
        onClose={(): void => {
          throw new Error('Function not implemented.');
        }}
        onPrimaryAction={(): void => {
          throw new Error('Function not implemented.');
        }}
        onSecondaryAction={(): void => {
          throw new Error('Function not implemented.');
        }}
        title={''}
        description={''}
        primaryButtonText={''}
        secondaryButtonText={''}
      />
      <Grid
        container
        spacing={4}
        sx={{
          paddingY: 4,
        }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <img
            src={IMG.signupImage || '/placeholder.svg'}
            alt="ADCB"
            loading="lazy"
            className="rounded-3xl max-w-full"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            variant="outlined"
            className="!rounded-2xl shadow-sm h-full"
            style={{ backgroundColor: COLORS.WHITE_SECONDARY }}
          >
            <CardContent
              sx={{
                paddingY: { md: 6 },
                paddingX: { md: 4 },
              }}
            >
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, handleChange }) => (
                  <Form className="mb-10">
                    <TextInput
                      name="name" // This should match the field name in initialValues
                      value={values.name}
                      onChange={handleChange}
                      placeholder={t('signUpScreen.enterYourName')}
                      label={t('signUpScreen.name')}
                      onBlur={() => {}}
                    />
                    <TextInput
                      name="phoneNumber" // This should match the field name in initialValues
                      countryCode="+971"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      placeholder={t('000 000 000')}
                      label={t('signUpScreen.phoneNumber')}
                      onBlur={() => {}}
                    />
                    <TextInput
                      name="email" // This should match the field name in initialValues
                      placeholder={t('signUpScreen.enterYourEmail')}
                      value={values.email}
                      onChange={handleChange}
                      label={t('signUpScreen.email')}
                      onBlur={() => {}}
                    />
                    <TextInput
                      name="emiratesId" // This should match the field name in initialValues
                      placeholder={t('signUpScreen.enterYourEid')}
                      value={values.emiratesId}
                      onChange={handleChange}
                      label={t('signUpScreen.eId')}
                      onBlur={() => {}}
                    />
                    {errorMessage && (
                      <Typography
                        sx={{
                          color: 'error.main',
                          marginY: 2,
                          textAlign: 'center',
                        }}
                      >
                        {errorMessage}
                      </Typography>
                    )}

                    <AppButton
                      type="submit"
                      onClick={() => {
                        // This will trigger form validation before submission
                        // You can keep this empty or add additional logic
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? t('common.loading') : t('signUpScreen.createYourProfile')}
                    </AppButton>
                  </Form>
                )}
              </Formik>
              <Typography
                sx={{
                  textAlign: 'center',
                  paddingY: 1.5,
                  color: '#000',
                }}
              >
                {t('signUpScreen.alreadyAMember')}
              </Typography>

              <AppButton
                onClick={() => {
                  console.log('Sign In');
                  navigate('/Login');
                }}
                withBorder
                fullWidth
              >
                {t('signUpScreen.signIn')}
              </AppButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <AuthFooter />
      {authModalOpen && (
        <OtpModal
          open={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            setIsEmailVerification(false); // Reset email verification state when closing
          }}
          phoneNumber={isEmailVerification ? maskedEmail : maskedPhoneNumber}
          onSubmit={(OTP: string) => handleOTPSubmit(OTP)}
          title={isEmailVerification ? t('otpModal.emailVerification') : t('otpModal.phoneVerification')}
          description={isEmailVerification ? t('otpModal.enterEmailOtp') : t('otpModal.enterPhoneOtp')}
        />
      )}
      {showDialog && (
        <CommonDialog
          open={showDialog}
          onClose={(): void => {
            setShowDialog(false);
          }}
          onPrimaryAction={(): void => {
            throw new Error('Function not implemented.');
          }}
          onSecondaryAction={(): void => {
            setShowDialog(false);
          }}
          title={'Cancel Pre-Approval Application'}
          description={
            'Are you sure you want to cancel? Your progress will not be saved and you will be returned to your mortgage dashboard.'
          }
          primaryButtonText={'yes, cancel'}
          secondaryButtonText={'continue pre-approval'}
        />
      )}
    </Box>
  );
};

export default SignupScreen;
