import test1 from "../assets/test1.jpg";
import test2 from "../assets/test2.jpg";
import test3 from "../assets/test3.jpg";
import test4 from "../assets/test4.jpg";
import "./SocialMediaGallery.css";

const images = [test1, test2, test3, test4, test4, test4];

export default function SocialMediaGallery() {
  return (
    <section className="social-media-gallery-container">
      <h2 className="social-media-gallery-title"></h2>
      <div className="social-media-gallery">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Instagram bild ${index + 1}`}
            className="fade-in"
            style={{ animationDelay: `${0.3 * (index + 1)}s` }}
          />
        ))}
      </div>
    </section>
  );
}
