/**
 * Alert Banner Component
 */

import React from "react";
import { Alert } from "react-bootstrap";

export type AlertType = "success" | "danger" | "warning" | "info";

interface AlertBannerProps {
  type: AlertType;
  message: string;
  title?: string;
  dismissible?: boolean;
  onClose?: () => void;
}

export function AlertBanner({
  type,
  message,
  title,
  dismissible = true,
  onClose,
}: AlertBannerProps) {
  return (
    <Alert variant={type} dismissible={dismissible} onClose={onClose}>
      {title && <Alert.Heading>{title}</Alert.Heading>}
      <p className="mb-0">{message}</p>
    </Alert>
  );
}

export default AlertBanner;
