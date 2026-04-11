import styled from "styled-components";

export const PrimaryButton = styled.button`
  padding: 12px 32px;
  background: #a6f080;
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;

  &:hover {
    background: #80d860;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled.button`
  padding: 10px 24px;
  background: transparent;
  color: #a8b2d8;
  border: 1px solid #3a3a60;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;

  &:hover {
    background: #1a1a2e;
    color: #e0e0ff;
    border-color: #5a5a90;
  }
`;

export const DangerButton = styled.button`
  padding: 8px 20px;
  background: transparent;
  color: #d63d2e;
  border: 1px solid #d63d2e;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: #d63d2e;
    color: #fff;
  }
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  padding: 10px 20px;
  background: ${({ $active }) => ($active ? "#a6f080" : "transparent")};
  color: ${({ $active }) => ($active ? "#1a1a2e" : "#a8b2d8")};
  border: 1px solid ${({ $active }) => ($active ? "#a6f080" : "#3a3a60")};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ $active }) => ($active ? "#a6f080" : "#1a1a2e")};
    color: ${({ $active }) => ($active ? "#1a1a2e" : "#e0e0ff")};
    border-color: ${({ $active }) => ($active ? "#a6f080" : "#5a5a90")};
  }
`;
