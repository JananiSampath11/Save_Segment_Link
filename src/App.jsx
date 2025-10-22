import './App.css';
import SegmentPage from './SegmentPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
	return (
		// <BrowserRouter>{/* For Local */}
		//  For git
		<BrowserRouter basename="/Save_Segment">
			<Routes>
				<Route path="/" element={<SegmentPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
