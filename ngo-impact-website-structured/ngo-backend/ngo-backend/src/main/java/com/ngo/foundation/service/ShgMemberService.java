package com.ngo.foundation.service;

import com.ngo.foundation.entity.ShgMember;
import com.ngo.foundation.repository.ShgMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShgMemberService {

    @Autowired
    private ShgMemberRepository shgMemberRepository;

    public ShgMember saveApplication(ShgMember member) {
        return shgMemberRepository.save(member);
    }
}
