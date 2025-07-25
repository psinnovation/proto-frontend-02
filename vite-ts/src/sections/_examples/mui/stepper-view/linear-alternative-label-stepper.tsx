import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const STEPS = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

// ----------------------------------------------------------------------

const isStepOptional = (step: number): boolean => step === 1;
const isStepSkipped = (step: number, skipped: Set<number>): boolean => skipped.has(step);

export function LinearAlternativeLabel() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const handleNext = useCallback(() => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep, skipped)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  }, [activeStep, skipped]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleSkip = useCallback(() => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  }, [activeStep]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, []);

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((label, index) => {
          const stepProps: {
            completed?: boolean;
          } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          if (isStepSkipped(index, skipped)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === STEPS.length ? (
        <>
          <Paper
            sx={[
              (theme) => ({
                p: 3,
                my: 3,
                minHeight: 120,
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
              }),
            ]}
          >
            <Typography sx={{ my: 1 }}>All steps completed - you&apos;re finished</Typography>
          </Paper>

          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          <Paper
            sx={[
              (theme) => ({
                p: 3,
                my: 3,
                minHeight: 120,
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
              }),
            ]}
          >
            <Typography sx={{ my: 1 }}> Step {activeStep + 1}</Typography>
          </Paper>

          <Box sx={{ display: 'flex' }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>

            <Box sx={{ flexGrow: 1 }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button variant="contained" onClick={handleNext}>
              {activeStep === STEPS.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
