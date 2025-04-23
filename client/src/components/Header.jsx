import React from 'react'
import 'Header.css'

function Header({setUser}) {

    return (
        <>
            <header className="header">
                <h1>Barcode Inventory</h1>
                <nav>
                    {!user ? (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                </nav>
            </header>
        </>
    )
}

export default Header