package com.ngo.foundation.controller;

import com.ngo.foundation.entity.ShgMember;
import com.ngo.foundation.service.ShgMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shg")
@CrossOrigin(origins = "*") // Adjust origins as needed for production security
public class ShgMemberController {

    @Autowired
    private ShgMemberService shgMemberService;

    @PostMapping("/join")
    public ResponseEntity<ShgMember> joinShg(@RequestBody ShgMember member) {
        ShgMember savedMember = shgMemberService.saveApplication(member);
        return ResponseEntity.ok(savedMember);
    }
}