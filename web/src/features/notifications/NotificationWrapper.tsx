import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Avatar, Box, createStyles, Group, keyframes, Stack, Text } from '@mantine/core';
import React, { Attributes, useRef, useState } from 'react';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  container: {
    width: 350,
    height: 'fit-content',
    backgroundColor: theme.colors.dark[6],
    color: theme.colors.dark[0],
    padding: 12,
    borderRadius: 5,
    fontFamily: 'Roboto',
    boxShadow: theme.shadows.sm,
    overflow: 'hidden',
  },
  title: {
    fontWeight: 500,
    lineHeight: 'normal',
    color: 'white',
  },
  description: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Roboto',
    lineHeight: 'normal',
  },
  descriptionOnly: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Roboto',
    lineHeight: 'normal',
  },
  notifyTimer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    transform: 'scale(1.4) rotate(-90deg)',
  },
}));

const enterAnimationTop = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(-30px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
});

const enterAnimationBottom = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(30px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
});

const exitAnimationTop = keyframes({
  from: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(-100%)',
  },
});

const exitAnimationRight = keyframes({
  from: {
    opacity: 1,
    transform: 'translateX(0px)',
  },
  to: {
    opacity: 0,
    transform: 'translateX(100%)',
  },
});

const exitAnimationLeft = keyframes({
  from: {
    opacity: 1,
    transform: 'translateX(0px)',
  },
  to: {
    opacity: 0,
    transform: 'translateX(-100%)',
  },
});

const exitAnimationBottom = keyframes({
  from: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(100%)',
  },
});

interface NotificationContentProps {
  data: NotificationProps;
  visible: boolean;
  position: string;
  classes: Record<string, string>;
}

const NotificationContent: React.FC<NotificationContentProps> = ({ data, visible, position, classes }) => {
  const timerElement = useRef<SVGCircleElement>(null);

  React.useEffect(() => {
    if (!data.showDuration) return;

    const totalTime = data.duration || 3000;
    let remainingTime = totalTime;
    const intervalTime = 16;
    const circumference = 2 * Math.PI * 5;

    const interval = setInterval(() => {
      remainingTime -= intervalTime;
      const progress = ((totalTime - remainingTime) / totalTime) * 100;
      const offset = (1 - (100 - progress) / 100) * circumference;
      
      timerElement.current?.setAttribute('stroke-dashoffset', offset.toString());

      if (remainingTime <= 0) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [data.showDuration, data.duration]);

  return (
    <Box
      sx={{
        animation: visible
          ? `${position?.includes('bottom') ? enterAnimationBottom : enterAnimationTop} 0.2s ease-out forwards`
          : `${
              position?.includes('right')
                ? exitAnimationRight
                : position?.includes('left')
                ? exitAnimationLeft
                : position === 'top-center'
                ? exitAnimationTop
                : position
                ? exitAnimationBottom
                : exitAnimationRight
            } 0.4s ease-in forwards`,
        ...data.style,
        backgroundColor:
          data.type === 'error'
            ? 'rgb(51, 0, 0)'
            : data.type === 'success'
            ? 'rgb(29, 94, 63)'
            : data.type === 'warning'
            ? 'rgb(135, 135, 16)'
            : 'rgb(31, 90, 128)',
      }}
      className={`${classes.container}`}
    >
      <Group noWrap spacing={12}>
        {data.icon && (
          <>
            {!data.iconColor ? (
              <Avatar
                color={
                  data.type === 'error'
                    ? 'red'
                    : data.type === 'success'
                    ? 'teal'
                    : data.type === 'warning'
                    ? 'yellow'
                    : 'blue'
                }
                style={{
                  alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                  textShadow: '0px 0px 50px rgba(255,0,0,0.6);',
                }}
                radius="xl"
                size={32}
              >
                <LibIcon icon={data.icon} fixedWidth size="lg" animation={data.iconAnimation} />
              </Avatar>
            ) : (
              <LibIcon
                icon={data.icon}
                animation={data.iconAnimation}
                style={{
                  color: data.iconColor,
                  alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                  textShadow: '0px 0px 50px rgba(255,0,0,0.6);',
                }}
                fixedWidth
                size="lg"
              />
            )}
          </>
        )}
        <Stack spacing={0}>
          {data.title && <Text className={classes.title}>{data.title}</Text>}
          {data.description && (
            <ReactMarkdown
              components={MarkdownComponents}
              className={`${!data.title ? classes.descriptionOnly : classes.description} description`}
            >
              {data.description}
            </ReactMarkdown>
          )}
        </Stack>
        {data.showDuration && (
          <div className={classes.notifyTimer}>
            <svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.5" cy="7.5" r="5" fill="none" stroke="white" strokeOpacity="0.17" strokeWidth="1.5" />
              <circle
                className="progressCircle"
                cx="7.5"
                cy="7.5"
                r="5"
                fill="none"
                stroke={
                  data.type === 'error'
                    ? 'rgb(179, 0, 0)'
                    : data.type === 'success'
                    ? 'rgb(61, 196, 131)'
                    : data.type === 'warning'
                    ? 'rgb(237, 237, 28)'
                    : 'rgb(56, 162, 229)'
                }
                strokeWidth="1.5"
                strokeDasharray="31.41592653589793"
                strokeDashoffset="31.41592653589793"
                style={{ transition: 'stroke-dashoffset 0.016s linear' }}
                ref={timerElement}
              />
            </svg>
          </div>
        )}
      </Group>
    </Box>
  );
};

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;
    const toastId = data.id?.toString();
    const duration = data.duration || 3000;
    let position = data.position || 'top-right';

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    if (toastId) setToastKey(prevKey => prevKey + 1);
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }
    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }
    toast.custom(
      (t) => <NotificationContent data={data} visible={t.visible} position={position} classes={classes} />,
      {
        id: toastId,
        duration: duration,
        position: position,
      }
    );
  });

  return <Toaster />;
};

export default Notifications;
