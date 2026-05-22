"use client";

type Props = {
  onDelete?: () => void;
};

export default function DeleteButton({
  onDelete,
}: Props) {
  return (
    <button
      onClick={onDelete}
      style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  );
}