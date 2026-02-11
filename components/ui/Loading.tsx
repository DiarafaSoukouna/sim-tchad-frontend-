import { FC } from "react";
import {
  GridLoader, BeatLoader
} from "react-spinners";

interface LoadingProps {
  /** Loader en plein écran ou contenu */
  fullScreen?: boolean;
  /** Taille des points */
  size?: number;
  /** Couleur du loader */
  color?: string;
}

const Loading: FC<LoadingProps> = ({
  size = 15,
  color = "black",
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <BeatLoader
        size={size} color={color} />
    </div>
  );
};

export default Loading;
