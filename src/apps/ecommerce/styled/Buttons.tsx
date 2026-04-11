import styled from "styled-components";

export const PrimaryButton = styled.button`
  padding: 12px 28px;
  background: #e63950;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;
  white-space: nowrap;

  &:hover {
    background: #c42d42;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #555;
    color: #999;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SecondaryButton = styled.button`
  padding: 11px 24px;
  background: transparent;
  color: #e0e0e0;
  border: 1px solid #444;
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
    background: #2a2a2a;
    border-color: #777;
    color: #fff;
  }
`;

export const FavoriteButton = styled.button<{ $active?: boolean }>`
  padding: 11px 24px;
  background: ${({ $active }) => ($active ? "#ff6b9d22" : "transparent")};
  color: ${({ $active }) => ($active ? "#ff6b9d" : "#aaa")};
  border: 1px solid ${({ $active }) => ($active ? "#ff6b9d" : "#444")};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &:hover {
    background: #ff6b9d22;
    color: #ff6b9d;
    border-color: #ff6b9d;
  }
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 18px;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: #2a2a2a;
    color: #fff;
  }
`;

export const DangerButton = styled.button`
  padding: 8px 20px;
  background: transparent;
  color: #e63950;
  border: 1px solid #e63950;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  white-space: nowrap;

  &:hover {
    background: #e63950;
    color: #fff;
  }
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 8px 18px;
  background: ${({ $active }) => ($active ? "#e63950" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#aaa")};
  border: 1px solid ${({ $active }) => ($active ? "#e63950" : "#333")};
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: #e63950;
    color: ${({ $active }) => ($active ? "#fff" : "#e63950")};
  }
`;
