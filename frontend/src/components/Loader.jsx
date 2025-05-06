import 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 48, animation: "spin 2s linear infinite" }} spin />;

const Loader = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Background with some opacity
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="text-center text-white animate-fade-in">
        <Spin indicator={antIcon} size="large" />
        <div
          className="mt-6 text-2xl font-semibold text-blue-400 animate-slide-up"
          style={{
            animation: "fade-in 2s ease-out",
          }}
        >
          Please wait while we prepare everything...
        </div>
        <div
          className="text-3xl font-bold mt-4 animate-slide-up"
          style={{
            textShadow: "0 0 10px #00f7ff, 0 0 20px #00f7ff, 0 0 30px #00f7ff, 0 0 40px #00f7ff, 0 0 50px #00f7ff, 0 0 75px #00f7ff, 0 0 100px #00f7ff",
            animation: "slide-up 2s ease-out",
          }}
        >
          PersonaGauge
        </div>
      </div>

      {/* Keyframe Animations as Inline Styles */}
      <style>
        {`
          @keyframes slide-up {
            0% {
              opacity: 0;
              transform: translateY(50px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fade-in 2s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 2s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
