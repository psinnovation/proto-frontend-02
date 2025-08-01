'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { countries } from 'src/assets/data';
import {
  SentIcon,
  PasswordIcon,
  PlanFreeIcon,
  EmailInboxIcon,
  NewPasswordIcon,
  PlanPremiumIcon,
  PlanStarterIcon,
} from 'src/assets/icons';
import {
  SeoIllustration,
  UploadIllustration,
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
  ForbiddenIllustration,
  ComingSoonIllustration,
  MotivationIllustration,
  MaintenanceIllustration,
  ServerErrorIllustration,
  PageNotFoundIllustration,
  OrderCompleteIllustration,
} from 'src/assets/illustrations';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { FlagIcon } from 'src/components/flag-icon';
import { FileThumbnail } from 'src/components/file-thumbnail';

import { ComponentBox, ComponentLayout } from '../../layout';

// ----------------------------------------------------------------------

const ASSETS_DIR = `${CONFIG.assetsDir}/assets/icons`;

const DEMO_COMPONENTS = [
  {
    name: 'Logo',
    component: (
      <ComponentBox>
        <Logo disabled sx={{ width: 64, height: 64 }} />
        <Logo disabled isSingle={false} sx={{ width: 180, height: 64 }} />
      </ComponentBox>
    ),
  },

  {
    name: 'Material icons',
    component: (
      <ComponentBox>
        <Link
          href="https://mui.com/components/icons/#main-content"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://mui.com/components/icons/#main-content
        </Link>
      </ComponentBox>
    ),
  },
  {
    name: 'Iconify icons',
    description: (
      <>
        <Link component={RouterLink} href="/components/foundation/icons/iconify">
          Check out
        </Link>{' '}
        the icons used in this template.
      </>
    ),
    component: (
      <ComponentBox>
        <Tooltip title="Iconify">
          <Iconify width={32} icon="solar:palette-bold-duotone" />
        </Tooltip>
        <Iconify width={32} icon="solar:palette-bold-duotone" sx={{ color: 'action.active' }} />
        <Iconify width={32} icon="solar:palette-bold-duotone" sx={{ color: 'action.disabled' }} />
        <Iconify width={32} icon="solar:palette-bold-duotone" sx={{ color: 'primary.main' }} />
        <Iconify width={32} icon="solar:palette-bold-duotone" sx={{ color: 'secondary.main' }} />
        <Iconify width={32} icon="solar:palette-bold-duotone" sx={{ color: 'info.main' }} />
        <Iconify width={32} icon="solar:palette-bold-duotone" sx={{ color: 'success.main' }} />
        <Iconify width={32} icon="solar:palette-bold-duotone" sx={{ color: 'warning.main' }} />
        <Iconify width={32} icon="solar:palette-bold-duotone" sx={{ color: 'error.main' }} />
      </ComponentBox>
    ),
  },
  {
    name: 'Local icons',
    component: (
      <ComponentBox>
        <Tooltip title="SvgColor">
          <SvgColor src={`${ASSETS_DIR}/navbar/ic-dashboard.svg`} sx={{ width: 32, height: 32 }} />
        </Tooltip>
        <SvgColor
          src={`${ASSETS_DIR}/navbar/ic-dashboard.svg`}
          sx={{ width: 32, height: 32, color: 'action.active' }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/navbar/ic-dashboard.svg`}
          sx={{ width: 32, height: 32, color: 'action.disabled' }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/navbar/ic-dashboard.svg`}
          sx={{ width: 32, height: 32, color: 'primary.main' }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/navbar/ic-dashboard.svg`}
          sx={{ width: 32, height: 32, color: 'secondary.main' }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/navbar/ic-dashboard.svg`}
          sx={{ width: 32, height: 32, color: 'info.main' }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/navbar/ic-dashboard.svg`}
          sx={{ width: 32, height: 32, color: 'success.main' }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/navbar/ic-dashboard.svg`}
          sx={{ width: 32, height: 32, color: 'warning.main' }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/navbar/ic-dashboard.svg`}
          sx={{ width: 32, height: 32, color: 'error.main' }}
        />
      </ComponentBox>
    ),
  },
  {
    name: 'Social icons',
    component: (
      <ComponentBox sx={{ gap: 3, flexDirection: 'column' }}>
        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap' }}>
          <Tooltip title="Google">
            <Iconify width={24} icon="socials:google" />
          </Tooltip>
          <Iconify width={24} icon="socials:instagram" />
          <Iconify width={24} icon="socials:facebook" />
          <Iconify width={24} icon="socials:linkedin" />
          <Iconify width={24} icon="socials:twitter" />
          <Iconify width={24} icon="socials:github" />
        </Box>

        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap' }}>
          <Iconify
            width={32}
            icon="socials:google"
            sx={[(theme) => ({ '--color': theme.vars.palette.primary.main })]}
          />
          <Iconify
            width={32}
            icon="socials:instagram"
            sx={[(theme) => ({ '--color': theme.vars.palette.warning.main })]}
          />
          <Iconify width={32} icon="socials:facebook" sx={{ color: 'secondary.main' }} />
          <Iconify width={32} icon="socials:linkedin" sx={{ color: 'info.main' }} />
          <Iconify width={32} icon="socials:twitter" sx={[{ color: 'success.main' }]} />
          <Iconify width={32} icon="socials:github" sx={[{ color: 'error.main' }]} />
        </Box>
      </ComponentBox>
    ),
  },
  {
    name: 'File icons',
    component: (
      <ComponentBox>
        <FileThumbnail tooltip file="example.mp3" />
        <FileThumbnail file="example.pdf" />
        <FileThumbnail file="example.psd" />
        <FileThumbnail file="example.doc" />
        <FileThumbnail file="example.xls" />
        <FileThumbnail file="example.zip" />
        <FileThumbnail file="example.ai" />
        <FileThumbnail file="example.ppt" />
        <FileThumbnail file="example.wav" />
        <FileThumbnail file="example.jpg" />
        <FileThumbnail file="example.m4v" />
        <FileThumbnail
          imageView
          file="https://assets.minimals.cc/public/assets/images/mock/cover/cover-1.webp"
        />
        <FileThumbnail file="example.custom" />
      </ComponentBox>
    ),
  },
  {
    name: 'Flag icons',
    component: (
      <ComponentBox sx={{ gap: 1.5 }}>
        {countries.map((country) =>
          country.label ? (
            <Tooltip key={country.code} title={`${country.label} - ${country.code}`}>
              <FlagIcon code={country.code} />
            </Tooltip>
          ) : null
        )}
      </ComponentBox>
    ),
  },
  {
    name: 'Assets icons',
    component: (
      <ComponentBox>
        <EmailInboxIcon />
        <NewPasswordIcon />
        <PasswordIcon />
        <PlanFreeIcon />
        <PlanPremiumIcon />
        <PlanStarterIcon />
        <SentIcon />

        <img alt="Empty cart" src={`${ASSETS_DIR}/empty/ic-cart.svg`} />
        <img alt="No chat selected" src={`${ASSETS_DIR}/empty/ic-chat-active.svg`} />
        <img alt="Empty chat" src={`${ASSETS_DIR}/empty/ic-chat-empty.svg`} />
        <img alt="Empty content" src={`${ASSETS_DIR}/empty/ic-content.svg`} />
        <img alt="Empty email" src={`${ASSETS_DIR}/empty/ic-email-disabled.svg`} />
        <img alt="No email selected" src={`${ASSETS_DIR}/empty/ic-email-selected.svg`} />
        <img alt="Empty folder" src={`${ASSETS_DIR}/empty/ic-folder-empty.svg`} />
        <img alt="Empty mail" src={`${ASSETS_DIR}/empty/ic-mail.svg`} />
      </ComponentBox>
    ),
  },
  {
    name: 'Assets illustrations',
    component: (
      <ComponentBox sx={{ gap: 5 }}>
        <BookingIllustration />
        <CheckInIllustration />
        <CheckoutIllustration />
        <br />
        <PageNotFoundIllustration sx={{ width: 240 }} />
        <ForbiddenIllustration sx={{ width: 240 }} />
        <ServerErrorIllustration sx={{ width: 240 }} />
        <MaintenanceIllustration sx={{ width: 240 }} />
        <ComingSoonIllustration sx={{ width: 240 }} />
        <SeoIllustration sx={{ width: 240 }} />
        <MotivationIllustration sx={{ width: 240 }} />
        <OrderCompleteIllustration sx={{ width: 240 }} /> <UploadIllustration sx={{ width: 240 }} />
      </ComponentBox>
    ),
  },
];

// ----------------------------------------------------------------------

export function IconsView() {
  return (
    <ComponentLayout
      sectionData={DEMO_COMPONENTS}
      heroProps={{
        heading: 'Icons',
        moreLinks: [
          'https://mui.com/components/material-icons',
          'https://iconify.design/icon-sets',
        ],
      }}
    />
  );
}
