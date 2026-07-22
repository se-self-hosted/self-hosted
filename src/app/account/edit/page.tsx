export default function EditProfile() {
    return (
      <div>
        <h1>Edit Profile</h1>
  
        {/* Avatar */}
        <div>
          <img
            src="/default-avatar.png"
            alt="Avatar"
            width={120}
            height={120}
          />
          <br />
          <input type="file" accept="image/*" />
        </div>
  
        <hr />
  
        {/* Name */}
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
          />
        </div>
  
        <br />
  
        {/* Email */}
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
          />
        </div>
  
        <br />
  
        {/* Password */}
        <div>
          <label htmlFor="password">New Password</label>
          <br />
          <input
            id="password"
            type="password"
            placeholder="Enter new password"
          />
        </div>
  
        <br />

        <div>
            <label htmlFor="password">Confirm Password</label>
            <br />
            <input
                id="password"
                type="password"
                placeholder="Enter new password"
            />
        </div>
  
        <button>Save Changes</button>
      </div>
    );
  }